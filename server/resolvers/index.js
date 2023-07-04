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
      //console.log('From [server/resolvers/index/query-folders]', { folders, context });
      return folders;
    },
    folder: async(parent, args) => { // args: data that request from client
      const folderId = args.folderId;
      //console.log({ folderId });
      const foundFolder = await FolderModel.findById(folderId);
      return foundFolder;
    },
    note: async (parent, args) => {
      const noteId = args.noteId;
      const note = await NoteModel.findById(noteId);
      return note;
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
    notes: async (parent, args) => {
      //console.log('From [server/index/Folder-notes]', {parent, args});
      const notes = await NoteModel.find({
        folderId: parent.id,
      });
      return notes;
    }
  },
  Mutation: {
    addNote: async (parent, args) => {
      const newNote = new NoteModel(args);
      await newNote.save();
      return newNote;
    }, 
    updateNote: async (parent, args) => {
      const noteId = args.id;
      const note = await NoteModel.findByIdAndUpdate(noteId, args);
      return note;
    },
    addFolder: async(parent, args, context) => {
      // create new folder by the data that client sent (args)
      const newFolder = new FolderModel({ ...args, authorId: context.uid });
      //console.log('[server/resolvers/addFolder]', { newFolder });
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