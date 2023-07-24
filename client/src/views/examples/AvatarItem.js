import React from 'react';
import { useDrag } from 'react-dnd';

const AvatarItem = ({ src }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'avatar',
    item: { src },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <img src={src} alt="Avatar" style={{ width: '100px', height: '100px' }} />
    </div>
  );
};

export default AvatarItem;
