import fakeData from '../fakeData/index.js';
import {
  FolderModel,
  AuthorModel,
  NoteModel,
} from '../models/index.js';

export const resolvers = {
  Query: {
    folders: async (parent, args, context) => { 
      const folders = await FolderModel.find({
        authorId: context.uid
      }).sort({
        updatedAt: 'desc',
      });
      console.log('From [server/resolvers/index/query-folders]', { folders, context });
      return folders;
    },
    folder: async(parent, args) => { // args: data that request from client
      const folderId = args.folderId;
      const foundFolder = await FolderModel.findOne({
        _id: folderId,
      });
      return foundFolder;
    },
    note: (parent, args) => {
      const noteId = args.noteId;
      return fakeData.notes.find(note => note.id === noteId); 
    },
  },
  Folder: {
    author: async (parent, args) => {
      //console.log('From [server/index/Folder-author]', {parent, args});
      const authorId = parent.authorId;
      const author = await AuthorModel.findOne({
        uid: authorId,
      });
      return author;
    },
    notes: (parent, args) => {
      //console.log('From [server/index/Folder-notes]', {parent, args});
      return fakeData.notes.filter(note => note.folderId === parent.id);
    }
  },
  Mutation: {
    addFolder: async(parent, args, context) => {
      // create new folder by the data that client sent (args)
      const newFolder = new FolderModel({ ...args, authorId: context.uid });
      console.log('[server/resolvers/addFolder]', { newFolder });
      await newFolder.save();
      return newFolder;
    },
    register: async(parent, args) => {
      const foundUser = await AuthorModel.findOne({ uid: args.uid });

      if (!foundUser) {
        const newUser = new AuthorModel(args);
        await newUser.save();
        return newUser;
      }
      
      return foundUser;
    }
  },
};