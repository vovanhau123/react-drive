import React from 'react';
import { Modal, Table, Icon, Button } from 'semantic-ui-react';
import './AccessDetailsModal.css';

const AccessDetailsModal = ({ open, onClose, item }) => {
  return (
    <Modal open={open} onClose={onClose} size="small" className="access-modal">
      <Modal.Header>
        <Icon name="shield" />
        Access Details
      </Modal.Header>
      <Modal.Content>
        <div className="owner-section">
          <h4>Owner</h4>
          <div className="user-info">
            <Icon name="user circle" size="large" />
            <div>
              <div className="user-name">{item?.owner}</div>
              <div className="user-email">{item?.ownerEmail}</div>
            </div>
          </div>
        </div>

        <div className="access-section">
          <h4>Who has access</h4>
          <Table basic="very">
            <Table.Body>
              {item?.accessList?.map((access, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="user-info">
                      <Icon name="user circle" />
                      <div>
                        <div className="user-email">{access.email}</div>
                        <div className="access-type">
                          <Icon name={access.type === 'edit' ? 'edit' : 'eye'} />
                          {access.type === 'edit' ? 'Can edit' : 'Can view'}
                        </div>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button basic icon="close" onClick={() => {/* Remove access */}} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="link-section">
          <h4>Share link</h4>
          <div className="link-info">
            <Icon name="linkify" />
            {item?.shareLink ? (
              <>
                <input type="text" value={item.shareLink} readOnly />
                <Button icon="copy" onClick={() => {/* Copy link */}} />
              </>
            ) : (
              <Button primary onClick={() => {/* Generate link */}}>
                Generate Link
              </Button>
            )}
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default AccessDetailsModal; 