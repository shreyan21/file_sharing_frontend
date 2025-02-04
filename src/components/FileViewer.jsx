import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/usercontext';
import './FileViewer.css';

function FileViewer({ fileData, onRename }) {
  const { usertoken } = useContext(UserContext);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFilename, setNewFilename] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (fileData) {
      setNewFilename(fileData.filename);
      setPreviewUrl(fileData.url);
      setFileType(fileData.type);
    }
  }, [fileData]);

  const handleRename = async (e) => {
    e.preventDefault();
    if (!newFilename || newFilename === fileData.filename) {
      setIsRenaming(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3200/file/rename/${fileData.filename}`,
        { newName: newFilename },
        { headers: { Authorization: usertoken} }
      );

      if (response.data.message === 'File renamed successfully') {
        onRename(fileData.filename, newFilename);
        setIsRenaming(false);
        setError('');
      }
    } catch (error) {
      console.error('Error renaming file:', error);
      setError(error.response?.data?.error || 'Error renaming file. Please try again.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = fileData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!fileData) return null;

  return (
    <div className="file-viewer-container">
      <div className="viewer-header">
        {isRenaming ? (
          <form className="rename-form" onSubmit={handleRename}>
            <input
              type="text"
              className="rename-input"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              autoFocus
            />
            <div className="rename-buttons">
              <button type="submit" className="save-button">
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsRenaming(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <span className="filename-display">{fileData.filename}</span>
            <div className="action-buttons">
              <button
                className="rename-button"
                onClick={() => setIsRenaming(true)}
              >
                Rename
              </button>
              <button className="download-button" onClick={handleDownload}>
                Download
              </button>
            </div>
          </>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="preview-content">
        {fileType.startsWith('image/') && (
          <img src={previewUrl} alt={fileData.filename} />
        )}

        {fileType === 'application/pdf' && (
          <embed
            src={previewUrl}
            type="application/pdf"
            className="pdf-viewer"
          />
        )}

        {fileType.startsWith('video/') && (
          <video controls className="video-player">
            <source src={previewUrl} type={fileType} />
            Your browser does not support the video tag.
          </video>
        )}

        {fileType.startsWith('audio/') && (
          <audio controls className="audio-player">
            <source src={previewUrl} type={fileType} />
            Your browser does not support the audio element.
          </audio>
        )}

        {!['image/', 'video/', 'audio/', 'application/pdf'].some((t) =>
          fileType.startsWith(t)
        ) && (
          <div className="unsupported-file">
            <p>Preview not available for this file type</p>
            <button className="download-button" onClick={handleDownload}>
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileViewer