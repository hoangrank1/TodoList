import { graphQLRequest } from "./request";

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String!) {
    folder(folderId: $folderId) {
      id
      name
      notes {
        id
        content
      }
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: {
      folderId,
    },
  });
  console.log('From [client/utils/notesLoader]', data);
  return data; 
}

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Note($noteId: String) {
    note(noteId: $noteId) {
      content
      id
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: {
      noteId,
    },
  });
  console.log('From [client/utils/noteLoader]', data);
  return data;
}

export const addNewNote = async ({ params, request}) => {
  // the request contains the data that submitted which includes content, and folderId
  const newNote = await request.formData();
  const formDataObj = {};
  newNote.forEach((value, key) => (formDataObj[key] = value));
  
  const query = `mutation Mutation($content: String!, $folderId: ID!) {
    addNote(content: $content, folderId: $folderId) {
      id
      content
    }
  }`;

  const { addNote } = await graphQLRequest({
    query,
    variables: formDataObj
  })

  console.log('From [client/utils/addNewNote]', { addNote });
  return addNote;
}

export const updateNote = async ({ params, request}) => {
  const updatedNote = await request.formData();
  const formDataObj = {};
  updatedNote.forEach((value, key) => (formDataObj[key] = value));
  
  const query = `mutation Mutation($id: String!, $content: String!) {
    updateNote(id: $id, content: $content) {
      id
      content
    }
  }`;

  const { updateNote } = await graphQLRequest({
    query,
    variables: formDataObj
  })

  console.log('From [client/utils/updateNote]', {updateNote})

  return updateNote;
}