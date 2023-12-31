import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './schemas/index.js';
import { resolvers } from './resolvers/index.js';
import './firebaseConfig.js';
import { getAuth } from 'firebase-admin/auth';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.invorp6.mongodb.net/ToDoList?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/',
});
// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

const authorizationJWT = async(req, res, next) => {
  //console.log('[server/authorization]', { authorization: req.headers.authorization });
  
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1];
    getAuth().verifyIdToken(accessToken)
      .then(decodedToken => {
        //console.log(decodedToken);
        res.locals.uid = decodedToken.uid; // store uid in res.locals so that the in the context can retrieve uid
        next();
      })
      .catch(err => {
        console.log({ err });
        return res.status(403).json({ message: 'Forbidden', error: err });
      });
  } else {
    //return res.status(401).json({ messsage: 'Unauthorized' });
    next();
  }
}

app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
  context: async({ req, res }) => {
    return {
      uid: res.locals.uid
    }
  }
}));

mongoose.set('strictQuery', false);
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async() => {
  console.log('[server] connected to Database');
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);
});

 