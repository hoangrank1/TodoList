import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton, 
  TextField, 
  Tooltip, 
} from '@mui/material'
import React, { 
  useState, 
  useEffect,
} from 'react'
import {
  CreateNewFolderOutlined,
} from '@mui/icons-material';
import { 
  addNewFolder, 
} from '../utils/folderUtils';
import { 
  useSearchParams, 
  useNavigate, 
} from 'react-router-dom';

export default function NewFolder() {
  const [newFolderName, setNewFolderName] = useState();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const popupName = searchParams.get('popup');

  const handleOpenPopUp = () => {
    setSearchParams({ popup: 'add-folder' });
  };

  const handleClose = () => {
    setNewFolderName('');
    navigate(-1); // return to the url ahead
  };

  const handleNewFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleAddNewFolder = async () => {
    const { addFolder } = await addNewFolder({
      name: newFolderName
    });
    console.log('From [client/componenets/NewFolder]', { addFolder });
    handleClose();
  };

  useEffect(() => {
    //console.log({popupName})
    if (popupName === 'add-folder') {
      setOpen(true);
      return;
    }

    setOpen(false);
  }, [popupName])
  
  return (
    <div>
      <Tooltip title="Add folder" onClick={handleOpenPopUp}>
        <IconButton size="small">
          <CreateNewFolderOutlined sx={{ color: 'white' }} />
        </IconButton>
      </Tooltip>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          New Folder
        </DialogTitle>
        
        <DialogContent>
          <TextField 
            autoFocus
            margin='dense'
            id='name'
            label='Folder Name'
            fullWidth
            size='small'
            variant='standard'
            sx={{ width: '400px' }}
            autoComplete='off'
            value={newFolderName}
            onChange={handleNewFolderNameChange}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>
            Cancle
          </Button>
          
          <Button onClick={handleAddNewFolder}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
