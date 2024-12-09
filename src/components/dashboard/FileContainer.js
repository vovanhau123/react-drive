import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import FileGrid from './FileGrid';
import FileList from './FileList';
import ShareModal from './ShareModal';
import FileDetails from './FileDetails';

const FileContainer = ({ 
  view, 
  searchQuery, 
  sortBy,
  items,
  emptyMessage,
  currentPath 
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleShare = (shareSettings) => {
    // TODO: Implement sharing
    setShareModalOpen(false);
  };

  return (
    <div className="file-container">
      {items.length === 0 ? (
        <div className="empty-state">
          {emptyMessage}
        </div>
      ) : (
        view === 'grid' ? (
          <FileGrid
            items={items}
            currentPath={currentPath}
            onItemClick={handleItemClick}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        ) : (
          <FileList
            items={items}
            currentPath={currentPath}
            onItemClick={handleItemClick}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        )
      )}

      {showDetails && selectedItem && (
        <FileDetails
          item={selectedItem}
          onClose={() => setShowDetails(false)}
        />
      )}

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
        item={selectedItem}
      />
    </div>
  );
};

export default FileContainer; 