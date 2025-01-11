import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, IconButton, Tooltip, Modal, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

// Sample file data (assuming this will come from backend later)
const files = [
  { id: 1, name: 'File 1.txt', type: 'text', permissions: ['read', 'write', 'download'], preview: 'This is a preview of the text file...', size: '1.2MB' },
  { id: 2, name: 'Document.pdf', type: 'pdf', permissions: ['read', 'download'], preview: 'This is the first line of the PDF document...', size: '2.5MB' },
  { id: 3, name: 'Report.docx', type: 'docx', permissions: ['read', 'write'], preview: 'This is the first paragraph of the document...', size: '3.1MB' },
  { id: 4, name: 'Image.jpg', type: 'image', permissions: ['read', 'download'], preview: 'No preview available for image...', size: '1.7MB' },
];

const FilePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = (fileId) => {
    alert(`Edit file with ID: ${fileId}`);
  };

  const handleFileDoubleClick = (fileId) => {
    // Here we will simulate opening the file. This could be replaced with actual backend logic.
    const file = files.find(f => f.id === fileId);
    setSelectedFile(file);
    setOpenModal(true); // Open the modal to display the file content.
  };

  const handleModalClose = () => setOpenModal(false);

  // Function to render a preview snippet based on file type
  const renderFilePreview = (file) => {
    switch (file.type) {
      case 'image':
        return <img src="https://via.placeholder.com/100" alt="Image Preview" style={{ width: '100%', height: 'auto' }} />;
      case 'pdf':
        return <Typography variant="body2" color="textSecondary">{file.preview}</Typography>;
      case 'docx':
        return <Typography variant="body2" color="textSecondary">{file.preview}</Typography>;
      case 'text':
        return <Typography variant="body2" color="textSecondary">{file.preview}</Typography>;
      default:
        return <Typography variant="body2" color="textSecondary">No Preview</Typography>;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: 3,
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        File Management
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 300, // Increased width
                height: 400, // Increased height
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#fff',
                position: 'relative',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)', // Added hover effect for better interactivity
                },
              }}
              onDoubleClick={() => handleFileDoubleClick(file.id)} // Handle double-click event
            >
              <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                {/* File Preview */}
                <Box sx={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                  {renderFilePreview(file)}
                </Box>

                {/* File Name */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                  {file.name}
                </Typography>

                {/* Permissions */}
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  Permissions: {file.permissions.join(', ')}
                </Typography>

                {/* File Size */}
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  {file.size}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Tooltip title="Edit File">
                  <IconButton
                    sx={{ backgroundColor: '#fff', borderRadius: '50%' }}
                    onClick={() => handleEditClick(file.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for File Preview or Read */}
      <Modal open={openModal} onClose={handleModalClose}>
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
            maxWidth: 600,
            width: '100%',
            height: '70vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            File: {selectedFile?.name}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {selectedFile?.type === 'image' ? (
              <img src="https://via.placeholder.com/500" alt="Image Preview" style={{ width: '100%', height: 'auto' }} />
            ) : (
              selectedFile?.preview
            )}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleModalClose}
          >
            Close Preview
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FilePage;
