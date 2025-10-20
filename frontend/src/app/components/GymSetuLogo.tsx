import React from 'react';

interface GymSetuLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const GymSetuLogo: React.FC<GymSetuLogoProps> = ({ 
  width = 200, 
  height = 60, 
  className = "" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 1200 360" 
      role="img" 
      aria-label="GymSetu logo"
      className={className}
    >
      <defs>
        {/* Gradient: gold → orange → magenta */}
        <linearGradient id="goldToMagenta" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFC107" />     {/* golden */}
          <stop offset="45%" stopColor="#FF8A00" />    {/* orange */}
          <stop offset="100%" stopColor="#E91E63" />   {/* magenta */}
        </linearGradient>

        {/* Soft shadow for subtle depth */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.4"/>
        </filter>
      </defs>

      {/* Text: GymSetu */}
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Montserrat, 'Poppins', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="140"
        letterSpacing="-2"
        fill="url(#goldToMagenta)"
        filter="url(#softShadow)"
      >
        GymSetu
      </text>
    </svg>
  );
};

export default GymSetuLogo;
