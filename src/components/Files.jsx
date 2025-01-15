import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card, CardContent, Typography, Modal, CircularProgress, Button } from '@mui/material';
import { UserContext } from '../contexts/usercontext.js';

const FilePage = () => {
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [previewContent, setPreviewContent] = useState({});
  const { usertoken } = useContext(UserContext);

  useEffect(() => {
    const loadFilesFromLocalStorage = () => {
      const storedFiles = localStorage.getItem('files');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
        loadFilePreviews(JSON.parse(storedFiles)); // Load previews from local storage
        setLoading(false);
      } else {
        fetchFiles();
      }
    };

    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:3200/file/showfiles', {
          method: 'GET',
          headers: { 'Authorization': `${usertoken} `},
        });
        const data = await response.json();
        setFiles(data.files || []);
        localStorage.setItem('files', JSON.stringify(data.files)); // Store files in localStorage
        await loadFilePreviews(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadFilePreviews = async (files) => {
      const previews = {};

      for (const file of files) {
        if (!file.isDirectory) {
          try {
            const response = await fetch(`http://localhost:3200/file/showfile/${file.name}`, {
              method: 'GET',
              headers: { 'Authorization': `${usertoken}` },
            });
            const blob = await response.blob();
            const contentType = response.headers.get('Content-Type');

            // Generate a small preview for images, text, and PDFs
            const url = URL.createObjectURL(blob);
            if (contentType && contentType.startsWith('image/')) {
              previews[file.name] = <img src={url} alt={file.name} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 4 }} />;
            } else if (contentType === 'text/plain') {
              const text = await response.text();
              previews[file.name] = <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{text.substring(0, 100)}...</Typography>;
            } else if (contentType === 'application/pdf') {
              previews[file.name] = <object data={url} type="application/pdf" width="100%" height="200px"></object>;
            } else {
              previews[file.name] = <Typography variant="body2" color="textSecondary">Preview Unavailable</Typography>;
            }
          } catch (error) {
            previews[file.name] = <Typography variant="body2" color="textSecondary">Error loading preview</Typography>;
          }
        }
      }

      setPreviewContent(previews);
    };

    loadFilesFromLocalStorage();
  }, [usertoken]);

  const handleFileDoubleClick = async (file) => {
    if (!file.isDirectory) {
      setLoadingContent(true);
      try {
        const response = await fetch(`http://localhost:3200/file/showfile/${file.name}`, {
          method: 'GET',
          headers: { 'Authorization': `${usertoken}` },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const contentType = response.headers.get('Content-Type');
        
        if (contentType && contentType.startsWith('image/')) {
          setFileContent(<img src={url} alt={file.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }} />);
        } else if (contentType === 'text/plain') {
          const text = await response.text();
          setFileContent(<pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#333' }}>{text}</pre>);
        } else if (contentType === 'application/pdf') {
          const pdfURL = URL.createObjectURL(blob);
          setFileContent(
            <object data={pdfURL} type="application/pdf" width="100%" height="600px" style={{ borderRadius: 8 }}>
              <p>Your browser does not support PDFs. <a href={pdfURL} download>Download PDF</a></p>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f8', padding: 3 }}>
      <Typography variant="h4" sx={{ marginTop: 6, marginBottom: 4, fontWeight: 'bold', color: '#333' }}>
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
                '&:hover': { transform: 'scale(1.05)' },
                '&:active': { transform: 'scale(0.98)' },
                overflow: 'hidden',
              }}
              onDoubleClick={() => handleFileDoubleClick(file)}
            >
              <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2, color: '#333' }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  {file.isDirectory ? 'Directory' :` Size: ${file.size} bytes`}
                </Typography>
              </CardContent>

              {/* File Preview */}
              <Box sx={{ padding: 2, height: 100, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {previewContent[file.name] || <Typography variant="body2" color="textSecondary">Loading Preview...</Typography>}
              </Box>
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
            maxWidth: '80vw',
            maxHeight: '80vh',
            width: '100%',
            height: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
            File Content
          </Typography>
          <Box sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {loadingContent ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ padding: 2 }}>{fileContent}</Box>
            )}
          </Box>
          <Button variant="contained" color="primary" fullWidth onClick={handleModalClose} sx={{ marginTop: 2 }}>
            Close Preview
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FilePage;