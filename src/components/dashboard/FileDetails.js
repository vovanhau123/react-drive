import React from 'react';
import { Segment, Icon, Button, Table, Image } from 'semantic-ui-react';
import './FileDetails.css';

const FileDetails = ({ item, onClose }) => {
  if (!item) return null;

  const getFileIcon = (type) => {
    switch (type) {
      case 'folder':
        return 'folder';
      case 'image':
        return 'file image';
      case 'pdf':
        return 'file pdf';
      case 'video':
        return 'file video';
      default:
        return 'file';
    }
  };

  const formatSize = (size) => {
    if (!size) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = parseInt(size);
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="file-details">
      <div className="details-header">
        <h3>Details</h3>
        <Icon name="close" onClick={onClose} />
      </div>

      <div className="details-content">
        <div className="preview-section">
          {item.type === 'image' ? (
            <Image src={item.url} className="file-preview" />
          ) : (
            <Icon name={getFileIcon(item.type)} size="huge" />
          )}
          <h4>{item.name}</h4>
        </div>

        <Table basic="very" className="details-table">
          <Table.Body>
            <Table.Row>
              <Table.Cell>Type</Table.Cell>
              <Table.Cell>{item.type.toUpperCase()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Size</Table.Cell>
              <Table.Cell>{formatSize(item.size)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Location</Table.Cell>
              <Table.Cell>{item.path || '/'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Owner</Table.Cell>
              <Table.Cell>{item.owner || 'Me'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Modified</Table.Cell>
              <Table.Cell>{formatDate(item.modifiedAt)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Created</Table.Cell>
              <Table.Cell>{formatDate(item.createdAt)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {item.description && (
          <div className="description-section">
            <h4>Description</h4>
            <p>{item.description}</p>
          </div>
        )}

        <div className="activity-section">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            {item.activities?.map((activity, index) => (
              <div key={index} className="activity-item">
                <Icon name={activity.icon || 'clock'} />
                <div className="activity-content">
                  <p>{activity.description}</p>
                  <span>{formatDate(activity.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-section">
          <Button icon labelPosition="left">
            <Icon name="download" />
            Download
          </Button>
          <Button icon labelPosition="left">
            <Icon name="share alternate" />
            Share
          </Button>
          <Button icon labelPosition="left" className="delete-button">
            <Icon name="trash" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileDetails; 