import { 
  graphQLRequest, 
} from "./request";

export const foldersLoader = async () => { // before Home is excuted the loader has been done
  const query = `query Folders {
    folders {
      id
      name
      createdAt
    }
  }`;

  const data = await graphQLRequest({ query });
  //console.log('From [client/utils/foldersLoader]', data);
  return data;
}

export const addNewFolder = async (newFolder) => {
  const query = `mutation Mutation($name: String!) {
    addFolder(name: $name) {
      name
      author {
        name
      }
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: { 
      name: newFolder.name 
    },
  });
  //console.log('From [client/utils/addNewFolder]', data);
  return data;
};