import React from 'react';
import FileContainer from './FileContainer';
import './StarredFiles.css';

const StarredFiles = ({ view, searchQuery, sortBy }) => {
  // Mock data - replace with actual API call
  const starredItems = [
    {
      id: 1,
      name: 'Important Documents',
      type: 'folder',
      items: 8,
      modifiedAt: '2024-03-20',
      starred: true
    },
    {
      id: 2,
      name: 'Contract.pdf',
      type: 'pdf',
      size: '1.2 MB',
      modifiedAt: '2024-03-19',
      starred: true
    }
  ];

  return (
    <FileContainer
      view={view}
      searchQuery={searchQuery}
      sortBy={sortBy}
      items={starredItems}
      emptyMessage="No starred files yet"
      currentPath="/starred"
    />
  );
};

export default StarredFiles; 