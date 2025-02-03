import React, { useEffect } from 'react';
import './FileViewer.css';

function FileViewer({ fileData }) {
    useEffect(() => {
        return () => {
            if (fileData?.url) {
                URL.revokeObjectURL(fileData.url);
            }
        };
    }, [fileData]);

    if (!fileData) return null;

    return (
        <div className="file-viewer-container">
            <h2 className="viewer-title">{fileData.filename}</h2>
            
            {fileData.type.startsWith('image/') && (
                <img src={fileData.url} alt={fileData.filename} className="preview-content" />
            )}

            {fileData.type === 'application/pdf' && (
                <embed 
                    src={fileData.url} 
                    type="application/pdf" 
                    className="pdf-viewer"
                />
            )}

            {fileData.type.startsWith('video/') && (
                <video controls className="video-player">
                    <source src={fileData.url} type={fileData.type} />
                    Your browser does not support the video tag.
                </video>
            )}

            {fileData.type.startsWith('audio/') && (
                <audio controls className="audio-player">
                    <source src={fileData.url} type={fileData.type} />
                    Your browser does not support the audio element.
                </audio>
            )}

            {!['image/', 'video/', 'audio/', 'application/pdf'].some(t => fileData.type.startsWith(t)) && (
                <div className="unsupported-file">
                    <p>Preview not available for this file type</p>
                    <a 
                        href={fileData.url} 
                        download={fileData.filename}
                        className="download-button"
                    >
                        Download File
                    </a>
                </div>
            )}
        </div>
    );
}

export default FileViewer;