import React from 'react';
import { Menu, Icon, Button, Sidebar } from 'semantic-ui-react';
import './MobileNav.css';

const MobileNav = ({ 
  visible, 
  onClose, 
  currentSection,
  onSectionChange,
  onUploadClick,
  storageInfo 
}) => {
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      direction="left"
      vertical
      visible={visible}
      className="mobile-nav"
    >
      <div className="mobile-nav-header">
        <div className="logo-section">
          <Icon name="cloud" size="large" />
          <h2>Cloud Drive</h2>
        </div>
        <Icon name="close" onClick={onClose} className="close-nav" />
      </div>

      <Button 
        className="mobile-upload-button"
        onClick={() => {
          onUploadClick();
          onClose();
        }}
      >
        <Icon name="plus" />
        Upload Files
      </Button>

      <Menu.Item 
        active={currentSection === 'my-drive'}
        onClick={() => {
          onSectionChange('my-drive');
          onClose();
        }}
      >
        <Icon name="home" />
        My Drive
      </Menu.Item>
      
      <Menu.Item 
        active={currentSection === 'shared'}
        onClick={() => {
          onSectionChange('shared');
          onClose();
        }}
      >
        <Icon name="share" />
        Shared with me
      </Menu.Item>
      
      <Menu.Item 
        active={currentSection === 'starred'}
        onClick={() => {
          onSectionChange('starred');
          onClose();
        }}
      >
        <Icon name="star" />
        Starred
      </Menu.Item>
      
      <Menu.Item 
        active={currentSection === 'trash'}
        onClick={() => {
          onSectionChange('trash');
          onClose();
        }}
      >
        <Icon name="trash" />
        Trash
      </Menu.Item>

      <div className="mobile-storage-info">
        <div className="storage-bar">
          <div 
            className="used" 
            style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }} 
          />
        </div>
        <p>{storageInfo.usedFormatted} of {storageInfo.totalFormatted} used</p>
      </div>
    </Sidebar>
  );
};

export default MobileNav; 