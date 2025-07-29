import React, { useMemo } from 'react';

interface TileProps {
  title: string;
  iconPath: string;
  imagePath?: string;
  top?: string;
  right?: string;
}

const Tile: React.FC<TileProps> = React.memo(({ title, iconPath, imagePath, top, right }) => {
  // Memoize the main container styles
  const containerStyles = useMemo(() => ({
    top: top || undefined,
    right: right || undefined,
    borderRadius: '48px',
    border: '2px solid transparent',
    background: 'rgba(255,255,255,0.01)',
    backgroundBlendMode: 'luminosity',
    backdropFilter: 'blur(2px)',
    position: 'relative' as const,
  }), [top, right])

  // Memoize the gradient border overlay styles
  const gradientBorderStyles = useMemo(() => ({
    pointerEvents: 'none' as const,
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '48px',
    padding: '2px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.01) 40%, rgba(255,255,255,0.01) 60%, rgba(255,255,255,0.10) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    zIndex: 2,
  }), [])

  // Memoize the image styles
  const imageStyles = useMemo(() => ({
    minHeight: '100%',
    minWidth: '100%',
    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)'
  }), [])

  // Memoize the bottom section styles
  const bottomSectionStyles = useMemo(() => ({
    display: 'flex',
    height: '88px',
    padding: '16px 16px 24px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3px',
    flexShrink: 0,
    alignSelf: 'stretch',
    background: 'transparent',
    margin: '0 auto',
  }), [])

  return (
    <div
      className="relative flex flex-col w-[350px] h-[440px] overflow-hidden shadow-xl p-4"
      style={containerStyles}
    >
      {/* Gradient border overlay */}
      <div style={gradientBorderStyles} />
      
      {/* Main image fills all space above the bottom row */}
      {imagePath && (
        <div className="flex-1 w-full flex items-stretch justify-stretch">
          <img 
            src={imagePath} 
            alt={title} 
            className="w-full h-full object-cover object-center"
            style={imageStyles}
            loading="lazy"
          />
        </div>
      )}
      
      {/* Logo/icon and title at the bottom */}
      <div style={bottomSectionStyles}>
        <img 
          src={iconPath} 
          alt={`${title} Icon`} 
          className="w-48px h-48px"
          loading="lazy"
        />
        <h3 className="text-white text-2xl font-bold font-outfit text-center flex-1 tracking-wide">
          {title}
        </h3>
      </div>
    </div>
  );
});

Tile.displayName = 'Tile';

export default Tile;
