import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import FileViewer from './FileViewer.jsx';
import './Files.css';
import { FaTrashAlt } from 'react-icons/fa'; // Importing delete icon
import { UserContext } from '../contexts/usercontext.js';

function FilePage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { usertoken } = useContext(UserContext); // Assuming usertoken is passed via context

  // Function to decode the JWT and extract the email
  const getUserEmailFromToken = () => {
    try {
      const decodedToken = jwtDecode(usertoken); // Decode the JWT to extract user info
      return decodedToken.email; // Assuming email is part of the token payload
    } catch (error) {
      console.error("Error decoding token", error);
      return null; // Return null if decoding fails
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const userEmail = getUserEmailFromToken(); // Get user email from token

      if (!userEmail) {
        console.error("User email could not be extracted from the token.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:3200/file/showfiles', {
          headers: { Authorization: usertoken }
        });

        // Extract filenames from the can_delete array for the logged-in user
        const canDeleteFiles = response.data.can_delete.filter(item => item.uploaded_by === userEmail).map(item => item.filename);

        // Add delete permission logic based on matching uploaded_by in can_delete
        const filesWithPermissions = response.data.fileData.map(file => {
          const canDelete = canDeleteFiles.includes(file.filename); // Check if the file is in can_delete list for the user

          return {
            ...file,
            canDelete // Add canDelete property based on the logic above
          };
        });

        setFiles(filesWithPermissions);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [usertoken]);

  const handleFileClick = async (filename) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/file/showfiles/${filename}`,
        {
          responseType: 'blob',
          headers: { Authorization: usertoken }
        }
      );
      
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      
      setSelectedFile({
        filename,
        url: URL.createObjectURL(blob),
        type: response.headers['content-type']
      });
      
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`http://localhost:3200/file/removefile/${filename}`, {
        headers: { Authorization: usertoken }
      });
      // Remove the deleted file from the list
      setFiles(files.filter(file => file.filename !== filename));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleRenameSuccess = (oldName, newName) => {
    setFiles(files.map(file => 
      file.filename === oldName ? {...file, filename: newName} : file
    ));
    setSelectedFile(prev => prev ? {...prev, filename: newName} : null);
  };

  return (
    <div className="file-page-container">
      <div className="file-list-section">
        <h2>Your Files</h2>
        <div className="file-grid">
          {files.map((file) => (
            <div 
              key={file.filename} 
              className={`file-card ${selectedFile?.filename === file.filename ? 'selected' : ''}`}
              onClick={() => handleFileClick(file.filename)}
            >
              <div className="file-icon">{file.icon}</div>
              <div className="file-info">
                <h3 className="filename">{file.filename}</h3>
                <div className="file-meta">
                  <span className="file-type">{file.type}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(2)}KB</span>
                </div>
              </div>
              <button 
                className="delete-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); // Prevents file preview from opening on delete click
                  handleDeleteFile(file.filename); 
                }}
                disabled={!file.canDelete} // Disable delete button if user doesn't have permission
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="file-preview-section">
        {selectedFile ? (
          <FileViewer 
            fileData={selectedFile} 
            onRename={handleRenameSuccess}
          />
        ) : (
          <div className="empty-preview">
            <p>Select a file to view it</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilePage;
