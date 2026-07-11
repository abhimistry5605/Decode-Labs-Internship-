import React from 'react';

const PulseArrow = ({ className = '', style = {} }) => {
  return (
    <svg 
      className={`pulse-arrow ${className}`} 
      viewBox="0 0 32 14" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        marginLeft: '6px',
        overflow: 'visible',
        ...style
      }}
    >
      {/* Lightning Bolt Symbol (⚡) */}
      <path 
        className="lightning" 
        d="M3,1 L7,1 L5,5 L9,5 L4,13 L5,8 L2,8 Z" 
      />
      {/* Circuit Trace Line (──) */}
      <line 
        className="wire-guide" 
        x1="9" 
        y1="7" 
        x2="26" 
        y2="7" 
      />
      {/* Pulse Line */}
      <line 
        className="wire-pulse" 
        x1="9" 
        y1="7" 
        x2="26" 
        y2="7" 
      />
      {/* Arrow Head (►) */}
      <path 
        className="head" 
        d="M25,4 L31,7 L25,10 Z" 
      />
    </svg>
  );
};

export default PulseArrow;
