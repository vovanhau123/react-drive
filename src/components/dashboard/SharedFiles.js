import React from 'react';
import FileContainer from './FileContainer';
import './SharedFiles.css';

const SharedFiles = ({ view, searchQuery, sortBy }) => {
  // Mock data - replace with actual API call
  const sharedItems = [
    {
      id: 1,
      name: 'Project Presentation',
      type: 'pdf',
      size: '2.5 MB',
      sharedBy: 'john@example.com',
      modifiedAt: '2024-03-20',
      accessLevel: 'edit'
    },
    {
      id: 2,
      name: 'Team Photos',
      type: 'folder',
      items: 15,
      sharedBy: 'sarah@example.com',
      modifiedAt: '2024-03-19',
      accessLevel: 'view'
    }
  ];

  return (
    <FileContainer
      view={view}
      searchQuery={searchQuery}
      sortBy={sortBy}
      items={sharedItems}
      emptyMessage="No files have been shared with you yet"
      currentPath="/shared"
    />
  );
};

export default SharedFiles; 