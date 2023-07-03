import fakeData from '../fakeData/index.js';
import {
  FolderModel,
} from '../models/index.js';

export const resolvers = {
  Query: {
    folders: async () => { 
      const folders = await FolderModel.find();
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
    author: (parent, args) => {
      //console.log('From [server/index/Folder-author]', {parent, args});
      const authorId = parent.authorId;
      return fakeData.authors.find(author => author.id === authorId);
    },
    notes: (parent, args) => {
      //console.log('From [server/index/Folder-notes]', {parent, args});
      return fakeData.notes.filter(note => note.folderId === parent.id);
    }
  },
  Mutation: {
    addFolder: async(parent, args) => {
      // create new folder by the data that client sent (args)
      const newFolder = new FolderModel({ ...args, authorId: '123' });
      console.log('[server/resolvers/addFolder]', { newFolder });
      await newFolder.save();
      return newFolder;
    },
  },
};