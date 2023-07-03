import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//import { typeDefs } from './schemas/index.js';
//import { resolvers } from './resolvers/index.js';
//import './firebaseConfig.js';
import fakeData from './fakeData/index.js'; 

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.invorp6.mongodb.net/ToDoList?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const typeDefs = `#graphql
  type Folder {
    id: String,
    name: String,
    createdAt: String,
    author: Author,
    notes: [Note]
  }

  type Note {
    id: String,
    content: String,
  }

  type Author {
    id: String,
    name: String,
  }
  
  type Query {
    folders: [Folder],
    folder(folderId: String): Folder
  }
`;

const resolvers = {
  Query: {
    folders: () => { 
      return fakeData.folders; 
    },
    folder: (parent, args) => { // args: data that request from client
      const folderId = args.folderId;
      return fakeData.folders.find(folder => folder.id === folderId); 
    }
  },
  Folder: {
    author: (parent, args) => {
      console.log('From [server/index/Folder-author]', {parent, args});
      const authorId = parent.authorId;
      return fakeData.authors.find(author => author.id === authorId);
    },
    notes: (parent, args) => {
      console.log('From [server/index/Folder-notes]', {parent, args});
      return fakeData.notes.filter(note => note.folderId === parent.id);
    }
  }
};

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
  next();
}

app.use(cors(), bodyParser.json(), expressMiddleware(server));

mongoose.set('strictQuery', false);
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async() => {
  console.log('[server] connected to Database');
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);
});

 