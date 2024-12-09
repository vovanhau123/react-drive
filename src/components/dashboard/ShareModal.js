import React, { useState } from 'react';
import { Modal, Form, Button, Icon, Divider, Label, Table } from 'semantic-ui-react';
import './ShareModal.css';

const ShareModal = ({ open, onClose, onShare, item }) => {
  const [loading, setLoading] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    public: false,
    allowDownload: false,
    password: '',
    expiryDate: '',
    shareLink: '',
    permissions: []
  });

  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('view');

  const accessLevels = [
    { key: 'view', text: 'Can view', icon: 'eye' },
    { key: 'edit', text: 'Can edit', icon: 'edit' },
    { key: 'admin', text: 'Admin', icon: 'user secret' }
  ];

  const handleAddPermission = () => {
    if (!email) return;

    setShareSettings(prev => ({
      ...prev,
      permissions: [
        ...prev.permissions,
        { email, accessLevel, id: Date.now() }
      ]
    }));
    setEmail('');
  };

  const handleRemovePermission = (id) => {
    setShareSettings(prev => ({
      ...prev,
      permissions: prev.permissions.filter(p => p.id !== id)
    }));
  };

  const generateShareLink = () => {
    // TODO: Implement actual share link generation
    const link = `https://yourdomain.com/share/${item.id}`;
    setShareSettings(prev => ({ ...prev, shareLink: link }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      await onShare(shareSettings);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Modal open={open} onClose={onClose} size="small" className="share-modal">
      <Modal.Header>
        <Icon name="share alternate" />
        Share "{item.name}"
      </Modal.Header>
      <Modal.Content>
        <div className="share-section">
          <h4>Share Link</h4>
          <div className="share-link-container">
            <input 
              type="text" 
              value={shareSettings.shareLink || 'Generate a share link'} 
              readOnly
            />
            {!shareSettings.shareLink ? (
              <Button primary onClick={generateShareLink}>
                Generate Link
              </Button>
            ) : (
              <Button 
                icon="copy" 
                onClick={() => copyToClipboard(shareSettings.shareLink)}
                className="copy-button"
              />
            )}
          </div>

          <div className="share-options">
            <Form.Checkbox
              label="Anyone with the link can view"
              checked={shareSettings.public}
              onChange={(e, data) => setShareSettings(prev => ({
                ...prev,
                public: data.checked
              }))}
            />
            <Form.Checkbox
              label="Allow download"
              checked={shareSettings.allowDownload}
              onChange={(e, data) => setShareSettings(prev => ({
                ...prev,
                allowDownload: data.checked
              }))}
            />
          </div>

          <div className="advanced-options">
            <Form.Input
              label="Password Protection"
              type="password"
              placeholder="Enter password"
              value={shareSettings.password}
              onChange={(e) => setShareSettings(prev => ({
                ...prev,
                password: e.target.value
              }))}
              icon="lock"
            />
            <Form.Input
              label="Link Expiry"
              type="datetime-local"
              value={shareSettings.expiryDate}
              onChange={(e) => setShareSettings(prev => ({
                ...prev,
                expiryDate: e.target.value
              }))}
              icon="calendar"
            />
          </div>
        </div>

        <Divider />

        <div className="share-section">
          <h4>Share with People</h4>
          <div className="add-people">
            <Form.Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="mail"
            />
            <Form.Select
              options={accessLevels}
              value={accessLevel}
              onChange={(e, { value }) => setAccessLevel(value)}
              className="access-select"
            />
            <Button primary onClick={handleAddPermission}>
              Add
            </Button>
          </div>

          {shareSettings.permissions.length > 0 && (
            <Table basic="very" className="permissions-table">
              <Table.Body>
                {shareSettings.permissions.map(permission => (
                  <Table.Row key={permission.id}>
                    <Table.Cell>
                      <div className="permission-info">
                        <Icon name="user" />
                        {permission.email}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Label basic>
                        <Icon name={accessLevels.find(a => a.key === permission.accessLevel)?.icon} />
                        {accessLevels.find(a => a.key === permission.accessLevel)?.text}
                      </Label>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Icon
                        name="close"
                        className="remove-permission"
                        onClick={() => handleRemovePermission(permission.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          primary 
          onClick={handleShare}
          loading={loading}
        >
          Share
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ShareModal; 