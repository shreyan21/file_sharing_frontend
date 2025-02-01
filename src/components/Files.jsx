import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileDisplay.css';

const FilePage = () => {
  const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    // Fetch the list of files from the server
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3200/file/showfiles'); // Your API to fetch the file list
        setFileList(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileClick = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:4000/showfiles/${fileName}`);
      if (!response.ok) {
        console.error('Failed to fetch file');
        return;
      }

      const contentType = response.headers.get('Content-Type');

      // Handle text files: Fetch as text
      if (contentType === 'text/plain') {
        const text = await response.json();  // Read the text content of the file
        setFileContent(text);  // Set text content to be displayed
        setFileUrl(null); // Clear file URL (no need to display as blob)
      } else if (contentType.startsWith('image/')) {
        // Handle image files
        const blob = await response.blob();
        const imageURL = URL.createObjectURL(blob);
        setFileUrl(imageURL);
        setFileType(contentType);
        setFileContent(null); // Clear text content for non-text files
      } else if (contentType === 'application/pdf') {
        // Handle PDF files
        const blob = await response.blob();
        const pdfURL = URL.createObjectURL(blob);
        setFileUrl(pdfURL);
        setFileType(contentType);
        setFileContent(null);
      } else {
        // Handle other files as a download or default behavior
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        setFileUrl(fileURL);
        setFileType(contentType);
        setFileContent(null);
      }
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };

  return (
    <div className="file-container">
      <h1>Files</h1>
      <div className="file-list">
        {fileList.length === 0 ? (
          <p>No files available</p>
        ) : (
          fileList.map((file) => (
            <div
              key={file.name}
              className="file-card"
              onClick={() => handleFileClick(file.name)}
            >
              <p className="file-name">{file.name}</p>
              {/* Add more visual indicators here (like icons) based on file type */}
            </div>
          ))
        )}
      </div>

      <div className="file-preview">
        {/* Display file content */}
        {fileContent && (
          <div className="file-text">
            <pre>{fileContent}</pre>
          </div>
        )}
        {fileUrl && fileType && (
          <div className="file-media">
            {/* Display images */}
            {fileType.startsWith('image/') && <img src={fileUrl} alt="File" />}
            
            {/* Display PDFs */}
            {fileType === 'application/pdf' && (
              <iframe src={fileUrl} title="PDF Viewer" width="100%" height="500px"></iframe>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePage;
