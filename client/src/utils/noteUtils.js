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