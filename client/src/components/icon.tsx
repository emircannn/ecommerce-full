import React from 'react';

interface IconProps {
  color?: string; // Renk özelliği
  width?: string; // Genişlik özelliği
  height?: string; // Yükseklik özelliği
  icon: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({ color = '#1a1a1a', width = '24px', height = '24px', icon }) => {
  return (
    <div style={{width, height, color}} className='flex items-center overflow-hidden justify-center shrink-0'>
        {icon}
      </div>
  );
};

export default Icon;
