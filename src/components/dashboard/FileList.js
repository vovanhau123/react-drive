import React from 'react';
import { Table, Icon, Checkbox, Dropdown } from 'semantic-ui-react';
import './FileList.css';

const FileList = ({ currentPath, onItemClick, searchQuery, sortBy }) => {
  // Mock data - replace with actual data from API
  const items = [
    { 
      id: 1, 
      name: 'Documents', 
      type: 'folder',
      items: 12,
      owner: 'Me',
      modifiedAt: '2024-03-20',
      size: '-'
    },
    { 
      id: 2, 
      name: 'Images', 
      type: 'folder',
      items: 48,
      owner: 'Me',
      modifiedAt: '2024-03-19',
      size: '-'
    },
    { 
      id: 3, 
      name: 'profile.jpg', 
      type: 'image',
      owner: 'Me',
      modifiedAt: '2024-03-18',
      size: '2.5 MB',
      starred: true
    },
    { 
      id: 4, 
      name: 'presentation.pdf', 
      type: 'pdf',
      owner: 'John Doe',
      modifiedAt: '2024-03-17',
      size: '1.2 MB',
      shared: true
    },
    { 
      id: 5, 
      name: 'video-tutorial.mp4', 
      type: 'video',
      owner: 'Me',
      modifiedAt: '2024-03-16',
      size: '45.8 MB'
    }
  ];

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'modified':
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        case 'size':
          return (b.size || '0').localeCompare(a.size || '0');
        default:
          return 0;
      }
    });

  const getItemIcon = (type) => {
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

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    // TODO: Implement context menu
  };

  return (
    <div className="file-list-container">
      <Table basic="very" className="file-list">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>
              <Checkbox />
            </Table.HeaderCell>
            <Table.HeaderCell width={6}>Name</Table.HeaderCell>
            <Table.HeaderCell width={3}>Owner</Table.HeaderCell>
            <Table.HeaderCell width={3}>Last Modified</Table.HeaderCell>
            <Table.HeaderCell width={2}>File Size</Table.HeaderCell>
            <Table.HeaderCell width={1}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredItems.map(item => (
            <Table.Row 
              key={item.id}
              onClick={() => onItemClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              className="file-row"
            >
              <Table.Cell>
                <Checkbox onClick={(e) => e.stopPropagation()} />
              </Table.Cell>
              <Table.Cell>
                <div className="file-name">
                  <Icon name={getItemIcon(item.type)} />
                  <span>{item.name}</span>
                  {item.starred && <Icon name="star" className="star-icon" />}
                  {item.shared && <Icon name="share" className="share-icon" />}
                </div>
              </Table.Cell>
              <Table.Cell>{item.owner}</Table.Cell>
              <Table.Cell>{item.modifiedAt}</Table.Cell>
              <Table.Cell>{item.size}</Table.Cell>
              <Table.Cell>
                <Dropdown
                  icon="ellipsis horizontal"
                  className="row-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown.Menu direction="left">
                    <Dropdown.Item icon="download" text="Download" />
                    <Dropdown.Item icon="share" text="Share" />
                    <Dropdown.Item 
                      icon={item.starred ? 'star outline' : 'star'} 
                      text={item.starred ? 'Remove from starred' : 'Add to starred'} 
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item icon="trash" text="Delete" className="delete-option" />
                  </Dropdown.Menu>
                </Dropdown>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default FileList; 