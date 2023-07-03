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
import {
  getAuth,
} from 'firebase-admin/auth';

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.invorp6.mongodb.net/ToDoList?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer })
  ],
});

await server.start();

const authorizationJWT = async(req, res, next) => {
  console.log('[server/authorization]', { authorization: req.headers.authorization });
  
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1];
    getAuth().verifyIdToken(accessToken)
      .then(decodedToken => {
        console.log(decodedToken);
        res.locals.uid = decodedToken.uid; // store uid in res.locals so that the in the context can retrieve uid
        next();
      })
      .catch(err => {
        console.log({ err });
        return res.status(403).json({ message: 'Forbidden', error: err });
      });
  } else {
    return res.status(401).json({ messsage: 'Unauthorized' });
  }

  next();
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

 