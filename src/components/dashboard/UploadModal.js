import React, { useState, useRef } from 'react';
import { Modal, Button, Icon, Progress, Tab } from 'semantic-ui-react';
import './UploadModal.css';

const UploadModal = ({ open, onClose, onUpload, currentPath }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      await onUpload(files, setProgress);
      setFiles([]);
      setProgress(0);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const panes = [
    {
      menuItem: { key: 'upload', icon: 'upload', content: 'Upload Files' },
      render: () => (
        <Tab.Pane>
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              hidden
            />
            <Icon name="cloud upload" size="huge" />
            <h3>Drag & drop files here</h3>
            <p>or click to browse your computer</p>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'drive', icon: 'google drive', content: 'Google Drive' },
      render: () => (
        <Tab.Pane>
          <div className="coming-soon">
            <Icon name="google drive" size="huge" />
            <h3>Coming Soon</h3>
            <p>Google Drive integration will be available soon!</p>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'url', icon: 'linkify', content: 'URL' },
      render: () => (
        <Tab.Pane>
          <div className="url-upload">
            <input 
              type="text" 
              placeholder="Enter file URL here..."
              className="url-input"
            />
            <Button primary disabled>Import</Button>
          </div>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Modal open={open} onClose={onClose} size="small" className="upload-modal">
      <Modal.Header>Upload Files</Modal.Header>
      <Modal.Content>
        <Tab panes={panes} activeIndex={panes.findIndex(p => p.menuItem.key === activeTab)} />

        {files.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files ({files.length})</h4>
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <Icon name="file" />
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <Icon 
                    name="close" 
                    className="remove-file"
                    onClick={() => handleRemoveFile(index)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="upload-progress">
            <Progress percent={progress} indicating>
              Uploading... {progress}%
            </Progress>
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          primary 
          onClick={handleUpload}
          loading={uploading}
          disabled={files.length === 0 || uploading}
        >
          Upload {files.length > 0 && `(${files.length} files)`}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UploadModal; 