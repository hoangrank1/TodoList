export const foldersLoader = async () => { // before Home is excuted the loader has been done
  const query = `query Folders {
    folders {
      id
      name
      createdAt
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
      //variables
    })
  });

  const { data } = await res.json();
  console.log('From [client/router/index/FolderList]', data);
  return data;
}