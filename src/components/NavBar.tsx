import { CgProfile } from 'react-icons/cg'
import logo from '../assets/Logo.png'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import './NavBar.css'

function NavBar() {
  const [languageModal, setLanguageModal] = useState(false)
  const [menuModal, setMenuModal] = useState(false)
  const languageModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageModalRef.current && !languageModalRef.current.contains(event.target as Node)) {
        setLanguageModal(false)
      }
    }

    if (languageModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageModal])

  const handleLanguageSelect = (language: string) => {
    console.log('Selected language:', language)
    // Optionally close the modal after selection
    setLanguageModal(false)
  }

  // Example of how to customize the login request
  // You can replace the handleLogin function with this more comprehensive version:

  const handleLogin = async () => {
    try {
      console.log('Attempting to login...')
      
      // Replace with your actual login endpoint
      const response = await axios.post('https://your-api.com/auth/login', {
        email: 'user@example.com',
        password: 'password123'
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Login successful:', response.data)
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
    } catch (error) {
      console.error('Login failed:', error)
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Login failed'
        alert(errorMessage) // Replace with proper error handling
      }
    }
  }


  return (
    <div className="navbar-container relative z-[100]">
      <img src={logo} alt="logo" className="navbar-logo" />
      <div className="navbar-desktop-menu overflow-visible">
        <div className="language-selector relative" ref={languageModalRef}>
          <button 
            onClick={() => setLanguageModal(!languageModal)} 
            className="language-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Emoji-Language--Streamline-Outlined-Material" height="24" width="24">
              <path fill="white" d="M15.6 23c-1.76665 0 -3.31665 -0.5375 -4.65 -1.6125 -1.33335 -1.075 -2.19165 -2.42915 -2.575 -4.0625 0.48335 0 0.97085 -0.0375 1.4625 -0.1125 0.49165 -0.075 0.95415 -0.1875 1.3875 -0.3375h5.829c0.02365 -0.23615 0.0414 -0.467 0.05325 -0.6925 0.01185 -0.2255 0.01775 -0.45635 0.01775 -0.6925v-0.6025c0 -0.20835 -0.01665 -0.4125 -0.05 -0.6125h-1.95c0.20465 -0.22765 0.39335 -0.4679 0.566 -0.72075 0.17265 -0.25285 0.334 -0.5126 0.484 -0.77925h4.625c-0.38335 -0.7 -0.88335 -1.3 -1.5 -1.8s-1.31665 -0.85835 -2.1 -1.075c0.03335 -0.23335 0.0625 -0.47915 0.0875 -0.7375 0.025 -0.25835 0.0375 -0.5125 0.0375 -0.7625 1.63335 0.38335 2.9875 1.2375 4.0625 2.5625C22.4625 12.2875 23 13.825 23 15.575c0 2.0625 -0.7194 3.8156 -2.15825 5.25925C19.40275 22.2781 17.6555 23 15.6 23Zm-1.975 -1.875c-0.18335 -0.45 -0.34165 -0.9 -0.475 -1.35 -0.13335 -0.45 -0.24165 -0.91665 -0.325 -1.4H10.4c0.35 0.63335 0.8 1.1875 1.35 1.6625 0.55 0.475 1.175 0.8375 1.875 1.0875Zm1.975 0.35c0.3 -0.48335 0.55 -0.9875 0.75 -1.5125 0.2 -0.525 0.35835 -1.05415 0.475 -1.5875H14.35c0.05 0.21665 0.20415 0.66665 0.4625 1.35 0.25835 0.68335 0.52085 1.26665 0.7875 1.75Zm1.975 -0.35c0.7 -0.25 1.325 -0.6125 1.875 -1.0875 0.55 -0.475 1 -1.02915 1.35 -1.6625h-2.425c-0.08335 0.48335 -0.19165 0.95 -0.325 1.4 -0.13335 0.45 -0.29165 0.9 -0.475 1.35Zm1 -4.25h2.78675c0.04215 -0.2 0.07575 -0.40835 0.10075 -0.625 0.025 -0.21665 0.0375 -0.44365 0.0375 -0.681 0 -0.23715 -0.0125 -0.45815 -0.0375 -0.663 -0.025 -0.205 -0.0625 -0.41535 -0.1125 -0.631h-2.775c0.03335 0.2 0.05415 0.4 0.0625 0.6 0.00835 0.2 0.0125 0.40835 0.0125 0.625 0 0.23485 -0.00415 0.4644 -0.0125 0.68875 -0.00835 0.22415 -0.02915 0.4529 -0.0625 0.68625Zm-10.1455 -1.05c-2.06385 0 -3.818 -0.72235 -5.2625 -2.167C1.722335 12.2135 1 10.45935 1 8.3955 1 6.33185 1.722335 4.583335 3.167 3.15 4.6115 1.716665 6.36565 1 8.4295 1c2.06365 0 3.81215 0.716665 5.2455 2.15s2.15 3.18185 2.15 5.2455c0 2.06385 -0.71665 3.818 -2.15 5.2625 -1.43335 1.44465 -3.18185 2.167 -5.2455 2.167Zm-0.005 -1.5c1.63365 0 3.0255 -0.579 4.1755 -1.737 1.15 -1.15785 1.725 -2.55365 1.725 -4.1875 0 -1.63365 -0.5766 -3.0255 -1.72975 -4.1755C11.4421 3.075 10.052 2.5 8.425 2.5c-1.63385 0 -3.02985 0.576585 -4.188 1.72975C3.079 5.3829 2.5 6.773 2.5 8.4c0 1.63385 0.579 3.02985 1.737 4.188 1.15785 1.158 2.55365 1.737 4.1875 1.737Zm-2.562 -6.7c0.20835 0 0.38335 -0.075 0.525 -0.225 0.14165 -0.15 0.2125 -0.32915 0.2125 -0.5375 0 -0.20835 -0.07185 -0.38335 -0.2155 -0.525 -0.14385 -0.14165 -0.322 -0.2125 -0.5345 -0.2125 -0.2 0 -0.375 0.07185 -0.525 0.2155 -0.15 0.14385 -0.225 0.322 -0.225 0.5345 0 0.2 0.075 0.375 0.225 0.525 0.15 0.15 0.32915 0.225 0.5375 0.225Zm2.5625 4.5c0.76 0 1.4369 -0.21325 2.03075 -0.63975 0.59365 -0.42665 1.0251 -0.97175 1.29425 -1.63525H5.1c0.26915 0.6635 0.7006 1.2086 1.29425 1.63525 0.59385 0.4265 1.27075 0.63975 2.03075 0.63975Zm2.5625 -4.5c0.20835 0 0.38335 -0.075 0.525 -0.225 0.14165 -0.15 0.2125 -0.32915 0.2125 -0.5375 0 -0.20835 -0.07185 -0.38335 -0.2155 -0.525 -0.14385 -0.14165 -0.322 -0.2125 -0.5345 -0.2125 -0.2 0 -0.375 0.07185 -0.525 0.2155 -0.15 0.14385 -0.225 0.322 -0.225 0.5345 0 0.2 0.075 0.375 0.225 0.525 0.15 0.15 0.32915 0.225 0.5375 0.225Z" strokeWidth="1.5" />
            </svg>
          </button>
          {languageModal && (
            <div className="language-modal absolute top-full right-0 mt-2 !z-10">
              <div className="language-text-container">
                <div className="language-item" onClick={() => handleLanguageSelect('English')}>
                  <div className="language-flag">
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_114_756)">
                        <rect width="28" height="20" rx="3" fill="#1A47B8"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.97863 0H0V3.33333L25.0052 20L28 20V16.6667L2.97863 0Z" fill="white"/>
                        <path d="M0.993465 0L28 18.0472V20H27.0298L0 1.93408V0H0.993465Z" fill="#F93939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M25.3333 1.52588e-05H28V3.33335C28 3.33335 10.6797 14.4374 2.66667 20H0V16.6667L25.3333 1.52588e-05Z" fill="white"/>
                        <path d="M28 0H27.0957L0 18.0628V20H0.993465L28 1.94868V0Z" fill="#F93939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.1828 0H17.8405V6.16909H28V13.8268H17.8405V20H10.1828V13.8268H0V6.16909H10.1828V0Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.7895 0H16.2105V7.69231H28V12.3077H16.2105V20H11.7895V12.3077H0V7.69231H11.7895V0Z" fill="#F93939"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_114_756">
                          <rect width="28" height="20" rx="3" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="language-name">
                    English
                  </span>
                </div>
                <div className="language-item" onClick={() => handleLanguageSelect('Italian')}>
                  <div className="language-flag">
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_114_765)">
                        <rect width="28" height="20" rx="3" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.6667 0H28.0001V20H18.6667V0Z" fill="#F93939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H9.33333V20H0V0Z" fill="#249F58"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_114_765">
                          <rect width="28" height="20" rx="3" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="language-name">
                    Italian
                  </span>
                </div>
                <div className="language-item" onClick={() => handleLanguageSelect('Spanish')}>
                  <div className="language-flag">
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_114_770)">
                        <rect width="28" height="20" rx="3" fill="#F93939"/>
                        <path d="M25.3333 0H2.66667C1.19391 0 0 1.19391 0 2.66667V17.3333C0 18.8061 1.19391 20 2.66667 20H25.3333C26.8061 20 28 18.8061 28 17.3333V2.66667C28 1.19391 26.8061 0 25.3333 0Z" fill="#F93939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 5.33333H28V14.6667H0V5.33333Z" fill="#FFDA2C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.9999 8.296V11.656C11.9999 12.5893 11.1039 13.336 9.99992 13.336H7.33325C6.23192 13.3333 5.33325 12.5827 5.33325 11.6533V8.29333C5.33325 7.53066 5.93059 6.89333 6.75192 6.68666C6.99992 5.99333 7.76259 6.61466 8.66659 6.61466C9.57592 6.61466 10.3333 5.99733 10.5813 6.688C11.3999 6.9 11.9999 7.53866 11.9999 8.296Z" fill="#D4AF2C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 9.33333H13.3333V13.3333H12V9.33333ZM4 9.33333H5.33333V13.3333H4V9.33333Z" fill="#CBCBCB"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 12H13.3333V13.3333H12V12ZM4 12H5.33333V13.3333H4V12Z" fill="#1A47B8"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 8H13.3333V9.33333H12V8ZM4 8H5.33333V9.33333H4V8Z" fill="#D4AF2C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.66675 8H8.00008V10H6.66675V8ZM9.33342 10.6667H10.6667V12.6667H9.33342V10.6667Z" fill="#AF010D"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.66675 10.6667H8.00008V12.6667H6.66675V10.6667Z" fill="#FFDA2C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.33325 8H10.6666V10H9.33325V8Z" fill="#AE6A3E"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.00008 8.00001L6.66675 6.66667H10.6667L9.33342 8.00001H8.00008Z" fill="#AF010D"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 5.33333H9.33333V6.66666H8V5.33333Z" fill="#D4AF2C"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_114_770">
                          <rect width="28" height="20" rx="3" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="language-name">
                    Spanish
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="nav-button"> 
          <span className="nav-button-text">
            Space Station
          </span>
        </button>
        <button className="login-button" onClick={handleLogin}>
          <span className="login-button-text">
            Login
          </span>
          <CgProfile 
            color="#004FF8" 
            size={20}
            className="login-button-icon"
          />
        </button>
      </div>
      <button onClick={() => setMenuModal(!menuModal)} className="mobile-menu-button">
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: menuModal ? 0 : 1, 
              scale: menuModal ? 0.8 : 1 
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="white" d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z" />
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: menuModal ? 1 : 0, 
              scale: menuModal ? 1 : 0.8 
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {menuModal && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="mobile-menu-content"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <motion.div 
                className="mobile-menu-items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <motion.span 
                  className="mobile-menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  Login
                </motion.span>
                <motion.span 
                  className="mobile-menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  Sign Up
                </motion.span>
                <motion.div 
                  className="mobile-menu-divider"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                />
                <motion.span 
                  className="mobile-menu-item mobile-menu-section"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  Language
                </motion.span>
                <motion.span 
                  className="mobile-menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.2 }}
                  onClick={() => handleLanguageSelect('English')}
                >
                  English
                </motion.span>
                <motion.span 
                  className="mobile-menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.2 }}
                  onClick={() => handleLanguageSelect('Spanish')}
                >
                  Spanish
                </motion.span>
                <motion.span 
                  className="mobile-menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.2 }}
                  onClick={() => handleLanguageSelect('Italian')}
                >
                  Italian
                </motion.span>
                <motion.div 
                  className="mobile-menu-divider"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                />
                <motion.span 
                  className="mobile-menu-item mobile-menu-section"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.2 }}
                >
                  Try for free
                </motion.span>
                <motion.span 
                  className="mobile-menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                >
                  Space Station
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavBar