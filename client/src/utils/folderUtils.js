import { graphQLRequest } from "./request";

export const foldersLoader = async () => { // before Home is excuted the loader has been done
  const query = `query Folders {
    folders {
      id
      name
      createdAt
    }
  }`;

  const data = await graphQLRequest({ query });
  console.log('From [client/utils/foldersLoader]', data);
  return data;
}