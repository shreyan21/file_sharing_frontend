import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/usercontext';
import FileViewer from './FileViewer'; // Add this import
import './Files.css';

function FilePage() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // New state
    const { usertoken } = useContext(UserContext);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:3200/file/showfiles', {
                    headers: { Authorization: `Bearer ${usertoken}` }
                });
                setFiles(response.data);
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
                    headers: { Authorization: `Bearer ${usertoken}` }
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

    return (
        <div className="file-page-container">
            <div className="file-list-section">
                <h2>Your Files</h2>
                <div className="file-grid">
                    {files.map((file) => (
                        <div 
                            key={file.filename} 
                            className="file-card"
                            onClick={() => handleFileClick(file.filename)}
                        >
                            <div className="file-icon">{file.icon}</div>
                            <div className="file-info">
                                <h3 className="filename">{file.filename}</h3>
                                <div className="file-meta">
                                    <span className="file-type">{file.type}</span>
                                    <span className="file-size">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {selectedFile && (
                <div className="file-preview-section">
                    <FileViewer fileData={selectedFile} />
                </div>
            )}
        </div>
    );
}

export default FilePage;