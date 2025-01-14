import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card, CardContent, Typography, IconButton, Tooltip, Modal, CircularProgress, Button } from '@mui/material';
import { UserContext } from '../contexts/usercontext.js';

const FilePage = () => {
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null); // To hold the actual content of the file
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const { usertoken } = useContext(UserContext);

  // Fetch files metadata from the backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:3200/file/showfiles', {
          method: 'GET',
          headers: { 'Authorization': `${usertoken}` },
        });
        const data = await response.json();
        setFiles(data.files || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [usertoken]);

  // Fetch file content when a file is selected (double-clicked)
  const handleFileDoubleClick = async (file) => {
    if (!file.isDirectory) {
        setLoadingContent(true);
        try {
            const response = await fetch(`http://localhost:3200/file/showfile/${file.name}`, {
                method: 'GET',
                headers: { 'Authorization': `${usertoken}` },
            });
          const blob= await response.blob()
           const url= URL.createObjectURL(blob)
            const contentType = response.headers.get('Content-Type');
         
            if (contentType && contentType.startsWith('image/')) {
                
                setFileContent(<img src={url} alt={file.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />);
                
            } else if (contentType === 'text/plain') {
                // Handle text files
                const text = await response.text();
                setFileContent(text);
            } else if (contentType === 'application/pdf') {
                // Handle PDF files
                const blob = await response.blob();
                const pdfURL = URL.createObjectURL(blob);
                setFileContent(
                    <object data={pdfURL} type="application/pdf" width="100%" height="600px">
                        <p>Your browser does not support PDFs. Download the PDF to view it: <a href={pdfURL}>Download PDF</a></p>
                    </object>
                );
            } else {
                setFileContent('Unsupported file type for preview');
            }
        } catch (error) {
            console.error('Error fetching file content:', error);
            setFileContent('Error fetching file content.');
        } finally {
            setLoadingContent(false);
        }
    }
};







  const handleModalClose = () => setFileContent(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        File Management
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.name}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 300,
                height: 250,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#fff',
                position: 'relative',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onDoubleClick={() => handleFileDoubleClick(file)}
            >
              <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  {file.isDirectory ? 'Directory' : `Size: ${file.size} bytes`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for File Preview or Read */}
      <Modal open={Boolean(fileContent)} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 800,
            width: '100%',
            height: '70vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            File Content
          </Typography>
          <Box sx={{ overflowY: 'auto' }}>
            {loadingContent ? (
              <CircularProgress />
            ) : (
              <div>{fileContent}</div> // Dynamically display the file content (image, text, etc.)
            )}
          </Box>
          <Button variant="contained" color="primary" fullWidth onClick={handleModalClose}>
            Close Preview
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FilePage;