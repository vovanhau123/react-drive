import React, { useState } from 'react';
import { Modal, Button, Icon, Radio } from 'semantic-ui-react';
import './RestoreModal.css';

const RestoreModal = ({ open, onClose, onRestore, item }) => {
  const [restoreLocation, setRestoreLocation] = useState('original');
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    setLoading(true);
    try {
      await onRestore(item, restoreLocation);
      onClose();
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="tiny" className="restore-modal">
      <Modal.Header>
        <Icon name="undo" />
        Restore Item
      </Modal.Header>
      <Modal.Content>
        <h4>Where would you like to restore "{item?.name}"?</h4>
        
        <div className="restore-options">
          <Radio
            label="Original location"
            value="original"
            checked={restoreLocation === 'original'}
            onChange={() => setRestoreLocation('original')}
          />
          <div className="location-path">{item?.originalPath || '/'}</div>
          
          <Radio
            label="My Drive"
            value="root"
            checked={restoreLocation === 'root'}
            onChange={() => setRestoreLocation('root')}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          primary 
          onClick={handleRestore}
          loading={loading}
        >
          Restore
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default RestoreModal; 