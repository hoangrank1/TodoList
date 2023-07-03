import { 
  Box,
  Card,
  CardContent,
  Grid, 
  List,
  Typography, 
} from '@mui/material'
import React, { useState } from 'react'
import { 
  Link, 
  Outlet,
  useParams, 
} from 'react-router-dom';

export default function NoteList() {
  const folder = {
    notes: [
      {
        id: '1',
        content: '<p>This is new note</p>',
      },
      {
        id: '2',
        content: '<p>Hahahaahahaha</p>',
      }
    ]
  };

  const {
    noteId
  } = useParams();
  console.log('From [client/components/NoteList]', {noteId});
  const [activeNoteId, setActiveNoteId] = useState(noteId);

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
            <Box>
              <Typography sx={{
                fontWeight: 'bold',
                color: 'white',
              }}>
                Notes
              </Typography>
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
