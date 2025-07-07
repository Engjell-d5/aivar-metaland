import { useState, useEffect } from 'react'
import './Carousel.css'
import { motion } from 'framer-motion'

// Import images directly 
import aiSharingLogo from '/AiSharing.png'
import landLogo from '/Land.png'
import storeLogo from '/Store.png'

interface CarouselButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
  logoSrc: string;
  isMobile?: boolean;
}

const CarouselButton: React.FC<CarouselButtonProps> = ({ label, onClick, isActive, logoSrc, isMobile }) => {
  
  // Try different paths for the image if the direct import doesn't work
  const getImagePath = () => {
    // First try the direct import
    if (logoSrc) return logoSrc;
    
    // If that doesn't work, try relative paths
    const fileName = label.replace(/\s+/g, '') + '.png';
    return fileName;
  };
  
  // Check which logo this is to apply specific dimensions for desktop
  const getLogoStyle = () => {
    const baseStyle = { mixBlendMode: 'normal' as const };
    
    // Logo dimensions only needed for desktop view
    // Mobile/tablet sizing is handled by CSS
    if (!isMobile) {
      if (logoSrc === aiSharingLogo) {
        return { ...baseStyle, width: '47.7px', height: '48px' };
      } else if (logoSrc === storeLogo) {
        return { ...baseStyle, width: '64px', height: '64px' };
      } else if (logoSrc === landLogo) {
        return { ...baseStyle, width: '63px', height: '48px' };
      }
    }
    
    // For mobile, we'll let CSS handle the sizing
    return { ...baseStyle };
  };
  
  return (
    <button 
      className={`carousel-button ${isActive ? 'active' : ''}`} 
      onClick={onClick}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '16px'
      }}>
        <img 
          src={getImagePath()} 
          alt={label} 
          className="button-logo"
          style={getLogoStyle()}
          loading="eager"
          decoding="async"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.classList.add('button-logo-fallback');
            target.classList.remove('button-logo');
          }}
        /> 
        <span className="button-text">{label}</span>
      </div>
    </button>
  );
};

interface CarouselProps {
  onButtonClick?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ onButtonClick }) => {
  // Button data with labels and logos
  const buttons = [
    { id: 1, label: 'AI SHARING', logoSrc: aiSharingLogo },
    { id: 2, label: 'AIVAR STORE', logoSrc: storeLogo },
    { id: 3, label: 'AIVAR METALAND', logoSrc: landLogo },
  ];
  
  const [activeIndex, setActiveIndex] = useState(1); // Center button (AIVAR STORE) is active by default
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [screenSize, setScreenSize] = useState('large');
  
  useEffect(() => {
    // Update the isMobile state and screen size on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 360) {
        setScreenSize('xs'); // Compact mode for very small screens
      } else if (width < 768) {
        setScreenSize('sm');
      } else if (width < 1024) {
        setScreenSize('md');
      } else if (width < 1440) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }
    };
    
    // Call once on mount to set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle button click
  const handleButtonClick = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Call the parent callback if provided
    if (onButtonClick) {
      onButtonClick(index);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  
  // Handle left arrow click - move active state one button to the left
  const handlePrevious = () => {
    if (isAnimating) return;
    const newIndex = (activeIndex - 1 + buttons.length) % buttons.length;
    handleButtonClick(newIndex);
  };
  
  // Handle right arrow click - move active state one button to the right
  const handleNext = () => {
    if (isAnimating) return;
    const newIndex = (activeIndex + 1) % buttons.length;
    handleButtonClick(newIndex);
  };
  
  return (
    <div className={`carousel-container carousel-size-${screenSize}`}>
      <div className="carousel-buttons">
        <motion.button 
          className="carousel-arrow carousel-arrow-left"
          onClick={handlePrevious}
          whileHover={{ scale: screenSize === 'xs' ? 1.05 : 1.1, boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </motion.button>
        
        {buttons.map((button, index) => (
          <motion.div 
            key={button.id}
            className="carousel-button-wrapper"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0
              // Removed scale and filter changes for active state
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CarouselButton
              label={button.label}
              logoSrc={button.logoSrc}
              onClick={() => handleButtonClick(index)}
              isActive={index === activeIndex}
              isMobile={isMobile}
            />
          </motion.div>
        ))}
        
        <motion.button 
          className="carousel-arrow carousel-arrow-right"
          onClick={handleNext}
          whileHover={{ scale: screenSize === 'xs' ? 1.05 : 1.1, boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default Carousel;
