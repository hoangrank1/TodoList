import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import AuthProvider from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import NoteList from "../components/NoteList";
import Note from "../components/Note";

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ); 
}

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Login />,
        path: '/login',
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Home />,
            path: '/',
            loader: async () => { // before Home is excuted the loader has been done
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
              console.log('From [client/router/index.jsx]', data);
              return data;
            },
            children: [
              {
                element: <NoteList />,
                path: `folders/:folderId`,
                children: [
                  {
                    element: <Note />,
                    path: `note/:noteId`,
                  }                
                ]
              }
            ]
          }
        ],
      },   
    ],
  },
]);