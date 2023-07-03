export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String) {
    folder(folderId: $folderId) {
      id
      name
      notes {
        id
        content
      }
    }
  }`;

  const res = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        folderId: folderId
      }
    })
  });

  const { data } = await res.json();
  console.log('From [client/router/index/NoteList]', data);
  return data;
}

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query ExampleQuery($noteId: String) {
    note(noteId: $noteId) {
      content
      id
    }
  }`;

  const res = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        noteId: noteId
      }
    })
  });

  const { data } = await res.json();
  console.log('From [client/router/index/NoteList]', data);
  return data;
}