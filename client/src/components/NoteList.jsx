import { 
  NoteAddOutlined, 
} from '@mui/icons-material';
import { 
  Box,
  Card,
  CardContent,
  Grid, 
  IconButton, 
  List,
  Tooltip,
  Typography, 
} from '@mui/material'
import React, { 
  useEffect,
  useState, 
} from 'react'
import { 
  Link, 
  Outlet,
  useParams, 
  useLoaderData,
  useSubmit,
  useNavigate,
} from 'react-router-dom';

export default function NoteList() {
  const { folder } = useLoaderData();
  //console.log('From [client/components/NoteList-folder]', folder); 

  const {
    noteId,
    folderId,
  } = useParams();
  //console.log('From [client/components/NoteList-noteId]', { noteId });
  
  const navigate = useNavigate();
  const [activeNoteId, setActiveNoteId] = useState(noteId);
  useEffect(() => {
    if (noteId) {
      setActiveNoteId(noteId);
      return;
    }

    if (folder?.notes?.[0]) {
      navigate(`note/${folder.notes[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, folder.notes]);

  const submit = new useSubmit();
  const handleAddNewNote = () => {
    submit( // action of the router will be executed  
      {
        content: '',
        folderId,
      },
      { 
        method: 'post', 
        action: `/folders/${folderId}` // the url wanting to submit   
      }
    );
  };

  return (
    <Grid container height="100%">
      <Grid item xs={4} sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: '#F0EBE3',
        heigh: '100%',
        overflowY: 'auto',
        padding: '10px',
        textAligh: 'left',
      }}>
        <List
          subheader={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
            }}>
              <Typography sx={{
                fontWeight: 'bold',
                color: 'white',
              }}>
                Notes
              </Typography>

              <Tooltip title='Add Note' onClick={handleAddNewNote}>
                <IconButton size='small'>
                  <NoteAddOutlined />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          {folder.notes.map(({id, content}) => {
            return (
              <Link 
                key={id} 
                to={`note/${id}`} 
                style={{ 
                  textDecoration: 'none'
                }}
                onClick={() => setActiveNoteId(id)}
              >
                <Card sx={{
                  mb: '5px',
                  backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null,
                }}>
                  <CardContent sx={{
                    '&:last-child': {
                      pb: '10px'
                    },
                    padding: '10px',
                  }}>
                    <div 
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold'
                      }} 
                      dangerouslySetInnerHTML={{
                        __html: `${content.substring(0, 30) || 'Empty' }`,
                      }}
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </List>
      </Grid>

      <Grid item xs={8}>
        <Outlet />
      </Grid>
    </Grid>
  )
}
