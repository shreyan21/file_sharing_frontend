import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, CircularProgress, Typography, Button, Card, IconButton, Tooltip } from '@mui/material';
import { UserContext } from '../contexts/usercontext.js';
import { PermissionContext } from '../contexts/permissioncontext.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import myimage from './placeholder-image.jpg';

const FilePage = () => {
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [previewContent, setPreviewContent] = useState({});

  const { usertoken } = useContext(UserContext);
  const { permission } = useContext(PermissionContext);

  useEffect(() => {
    // Load files from localStorage or fetch from the server
    const loadFiles = async () => {
      const storedFiles = localStorage.getItem('files');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
        await loadFilePreviews(JSON.parse(storedFiles));
        setLoading(false);
      } else {
        await fetchFiles();
      }
    };

    // Fetch files from the server
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:3200/file/showfiles', {
          method: 'GET',
          headers: { 'Authorization': usertoken },
        });
        const data = await response.json();
        setFiles(data.files || []);
        localStorage.setItem('files', JSON.stringify(data.files));
        await loadFilePreviews(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load file previews (images, text, PDF) from the server
    const loadFilePreviews = async (files) => {
      const previews = {};
      for (const file of files) {
        if (!file.isDirectory) {
          try {
            const response = await fetch(`http://localhost:3200/file/showfile/${file.name}`, {
              method: 'GET',
              headers: { 'Authorization': usertoken },
            });
            const blob = await response.blob();
            const contentType = response.headers.get('Content-Type');
            const url = URL.createObjectURL(blob);

            if (contentType && contentType.startsWith('image/')) {
              previews[file.name] = <img src={url} alt={file.name} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 4 }} />;
            } else if (contentType === 'text/plain') {
              const text = await response.text();
              previews[file.name] = <object data={text} type="application/pdf" width="100%" height="200px" />;
            } else if (contentType === 'application/pdf') {
              previews[file.name] = <object data={url} type="application/pdf" width="100%" height="200px" />;
            } else {
              previews[file.name] = <img src={myimage} alt={file.name} style={{ width: '100%', height: '238px', objectFit: 'cover', borderRadius: 4 }} />;
            }
          } catch (error) {
            previews[file.name] = <Typography variant="body2" color="textSecondary">Error loading preview</Typography>;
          }
        }
      }
      setPreviewContent(previews);
    };

    loadFiles();
  }, [usertoken,files]);

  // Handle file preview logic
  const handleFilePreview = async (file) => {
    setLoadingContent(true);
    try {
      const response = await fetch(`http://localhost:3200/file/showfile/${file.name}`, {
        method: 'GET',
        headers: { 'Authorization': usertoken },
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
        setFileContent(<object data={pdfURL} type="application/pdf" width="100%" height="600px" style={{ borderRadius: 8 }} />);
      } else {
        setFileContent('Unsupported file type for preview');
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      setFileContent('Error fetching file content.');
    } finally {
      setLoadingContent(false);
    }
  };
  const removeFile = async (name) => {
    try {
      const result = await fetch(`http://localhost:3200/file/removefile/${name}`, { method: 'DELETE', headers: { 'Authorization': `${usertoken}` } })
      if (result.status === 200) {
          const data=await result.json()
          const deletedFile=data.deletedFile
         let copiedFiles=[...files]
         const index=copiedFiles.findIndex(file=>file.name===deletedFile)
         copiedFiles.splice(index,1)
         localStorage.setItem('files',JSON.stringify(copiedFiles))
         setFiles(copiedFiles)
          
      }
    }
    catch (e) {

    }
  }
  // Check if the user has permission to edit the file
  const checkPermission = (fileName) => {
    for (const perm of permission) {
      if (perm.file_name === fileName) {
        return perm.can_edit;
      }
    }
    return false;
  };

  // Handle modal close
  const handleModalClose = () => setFileContent(null);

  // Loading Spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
   <>
   <div className="container">
    <div className="row">
      {files.map((file)=>(
        <div className="col-sm-6 col-md-4 col-lg-3" style={{minWidth:"18rem",maxHeight:"17rem",textAlign:"center"}}>
          <div className="card card-body">
            {file.icon}
            {file.name}
          </div>
        </div>
      ))}
    </div>
   </div>
   </>
  );
};

export default FilePage;
