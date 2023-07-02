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
  useNavigate, 
} from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  const auth = new getAuth();
  const { 
    user, 
  } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    const res = await signInWithPopup(auth, provider);

    console.log('[From client/pages/Login]', { res });
  }

  if (user?.uid) {
    navigate('/');
    return
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
