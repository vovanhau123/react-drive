import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import FileContainer from './FileContainer';
import './TrashFiles.css';

const TrashFiles = ({ view, searchQuery, sortBy }) => {
  // Mock data - replace with actual API call
  const trashedItems = [
    {
      id: 1,
      name: 'Old Project',
      type: 'folder',
      items: 5,
      deletedAt: '2024-03-20',
      expiresAt: '2024-04-20'
    },
    {
      id: 2,
      name: 'backup.zip',
      type: 'file',
      size: '50 MB',
      deletedAt: '2024-03-19',
      expiresAt: '2024-04-19'
    }
  ];

  const handleEmptyTrash = () => {
    // TODO: Implement empty trash functionality
  };

  return (
    <div className="trash-container">
      <div className="trash-header">
        <div className="trash-info">
          <p>Items will be permanently deleted after 30 days</p>
        </div>
        <Button negative onClick={handleEmptyTrash}>
          <Icon name="trash" />
          Empty Trash
        </Button>
      </div>

      <FileContainer
        view={view}
        searchQuery={searchQuery}
        sortBy={sortBy}
        items={trashedItems}
        emptyMessage="Trash is empty"
        currentPath="/trash"
      />
    </div>
  );
};

export default TrashFiles; 