import React, { 
  useContext, 
} from 'react';
import {
  Button,
  Typography,
} from '@mui/material';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from 'firebase/auth';
import { 
  AuthContext, 
} from '../context/AuthProvider';
import { 
  Navigate,
} from 'react-router-dom';
import { 
  graphQLRequest, 
} from '../utils/request';

export default function Login() {
  //const navigate = useNavigate(); : issue: using hook useNavigate outside useEffect, when not using useEffect then should use compenet Navigate
  
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    const { 
      user: { uid, displayName }
    } = await signInWithPopup(auth, provider);

    const query = `mutation register($uid: String!, $name: String!) {
      register(uid: $uid, name: $name) {
        uid
        name
      }
    }`;
    
    const { data } = await graphQLRequest({ 
      query,
      variables: {
        uid: uid,
        name: displayName,
      }
    });

    console.log('[From client/pages/Login]', { data });
  }  

  if (localStorage.getItem('accessToken')) {
    // navigate('/');
    return <Navigate to="/" />
  }

  return (
    <div>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>
        Welcome to Note App
      </Typography>
      <Button variant='outlined' onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </div>
  )
}
