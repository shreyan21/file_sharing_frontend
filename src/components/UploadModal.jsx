import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/usercontext.js';

const UploadModal = ({ onClose, onUpload }) => {
  const { usertoken } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({
    can_read: [],
    can_edit: [],
    can_download: []
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3200/file/users', {
        headers: { Authorization: usertoken }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('can_read', JSON.stringify(permissions.can_read));
    formData.append('can_edit', JSON.stringify(permissions.can_edit));
    formData.append('can_download', JSON.stringify(permissions.can_download));

    try {
      await axios.post('http://localhost:3200/file/upload', formData, {
        headers: {
          Authorization: usertoken,
          'Content-Type': 'multipart/form-data'
        }
      });
      onUpload();
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Upload New File</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select File:</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              required 
            />
          </div>
          
          <div className="permission-section">
            <h4>Set Permissions:</h4>
            <div className="permission-group">
              <label>Can Edit (Text files only):</label>
              <select
                multiple
                onChange={(e) => setPermissions({...permissions, can_edit: Array.from(e.target.selectedOptions, o => o.value)})}
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="permission-group">
              <label>Can Download:</label>
              <select
                multiple
                onChange={(e) => setPermissions({...permissions, can_download: Array.from(e.target.selectedOptions, o => o.value)})}
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="permission-group">
              <label>Can View:</label>
              <select
                multiple
                onChange={(e) => setPermissions({...permissions, can_read: Array.from(e.target.selectedOptions, o => o.value)})}
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;