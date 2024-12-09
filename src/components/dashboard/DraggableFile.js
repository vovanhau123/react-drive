import React from 'react';
import { useDrag } from 'react-dnd';
import { Icon } from 'semantic-ui-react';
import './DraggableFile.css';

const DraggableFile = ({ item, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FILE',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`draggable-file ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
      {isDragging && (
        <div className="drag-preview">
          <Icon name={item.type === 'folder' ? 'folder' : 'file'} />
          <span>{item.name}</span>
        </div>
      )}
    </div>
  );
};

export default DraggableFile; 