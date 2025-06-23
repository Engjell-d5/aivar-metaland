import { CgProfile } from "react-icons/cg";
import logo from '../assets/Logo.png';
import { useState, useRef, useEffect } from 'react';
function NavBar() {
    const [languageModal, setLanguageModal] = useState(false);
    const [menuModal, setMenuModal] = useState(false);
    const languageModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageModalRef.current && !languageModalRef.current.contains(event.target as Node)) {
                setLanguageModal(false);
            }
        };

        if (languageModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [languageModal]);
  return (
    <div className='flex justify-between items-center p-4 bg-[#262627] text-black relative'>
        <img src={logo} alt="logo" className='w-[154px] h-[48px]' />
        <div className='hidden sm:flex gap-4 text-white justify-center items-center'>
          <div className="relative" ref={languageModalRef}>
              <button onClick={() => setLanguageModal(!languageModal)} className='bg-[#244ff9] rounded-[24px] w-[40px] h-[40px] flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Emoji-Language--Streamline-Outlined-Material" height="24" width="24">
                  <path fill="white" d="M15.6 23c-1.76665 0 -3.31665 -0.5375 -4.65 -1.6125 -1.33335 -1.075 -2.19165 -2.42915 -2.575 -4.0625 0.48335 0 0.97085 -0.0375 1.4625 -0.1125 0.49165 -0.075 0.95415 -0.1875 1.3875 -0.3375h5.829c0.02365 -0.23615 0.0414 -0.467 0.05325 -0.6925 0.01185 -0.2255 0.01775 -0.45635 0.01775 -0.6925v-0.6025c0 -0.20835 -0.01665 -0.4125 -0.05 -0.6125h-1.95c0.20465 -0.22765 0.39335 -0.4679 0.566 -0.72075 0.17265 -0.25285 0.334 -0.5126 0.484 -0.77925h4.625c-0.38335 -0.7 -0.88335 -1.3 -1.5 -1.8s-1.31665 -0.85835 -2.1 -1.075c0.03335 -0.23335 0.0625 -0.47915 0.0875 -0.7375 0.025 -0.25835 0.0375 -0.5125 0.0375 -0.7625 1.63335 0.38335 2.9875 1.2375 4.0625 2.5625C22.4625 12.2875 23 13.825 23 15.575c0 2.0625 -0.7194 3.8156 -2.15825 5.25925C19.40275 22.2781 17.6555 23 15.6 23Zm-1.975 -1.875c-0.18335 -0.45 -0.34165 -0.9 -0.475 -1.35 -0.13335 -0.45 -0.24165 -0.91665 -0.325 -1.4H10.4c0.35 0.63335 0.8 1.1875 1.35 1.6625 0.55 0.475 1.175 0.8375 1.875 1.0875Zm1.975 0.35c0.3 -0.48335 0.55 -0.9875 0.75 -1.5125 0.2 -0.525 0.35835 -1.05415 0.475 -1.5875H14.35c0.05 0.21665 0.20415 0.66665 0.4625 1.35 0.25835 0.68335 0.52085 1.26665 0.7875 1.75Zm1.975 -0.35c0.7 -0.25 1.325 -0.6125 1.875 -1.0875 0.55 -0.475 1 -1.02915 1.35 -1.6625h-2.425c-0.08335 0.48335 -0.19165 0.95 -0.325 1.4 -0.13335 0.45 -0.29165 0.9 -0.475 1.35Zm1 -4.25h2.78675c0.04215 -0.2 0.07575 -0.40835 0.10075 -0.625 0.025 -0.21665 0.0375 -0.44365 0.0375 -0.681 0 -0.23715 -0.0125 -0.45815 -0.0375 -0.663 -0.025 -0.205 -0.0625 -0.41535 -0.1125 -0.631h-2.775c0.03335 0.2 0.05415 0.4 0.0625 0.6 0.00835 0.2 0.0125 0.40835 0.0125 0.625 0 0.23485 -0.00415 0.4644 -0.0125 0.68875 -0.00835 0.22415 -0.02915 0.4529 -0.0625 0.68625Zm-10.1455 -1.05c-2.06385 0 -3.818 -0.72235 -5.2625 -2.167C1.722335 12.2135 1 10.45935 1 8.3955 1 6.33185 1.722335 4.583335 3.167 3.15 4.6115 1.716665 6.36565 1 8.4295 1c2.06365 0 3.81215 0.716665 5.2455 2.15s2.15 3.18185 2.15 5.2455c0 2.06385 -0.71665 3.818 -2.15 5.2625 -1.43335 1.44465 -3.18185 2.167 -5.2455 2.167Zm-0.005 -1.5c1.63365 0 3.0255 -0.579 4.1755 -1.737 1.15 -1.15785 1.725 -2.55365 1.725 -4.1875 0 -1.63365 -0.5766 -3.0255 -1.72975 -4.1755C11.4421 3.075 10.052 2.5 8.425 2.5c-1.63385 0 -3.02985 0.576585 -4.188 1.72975C3.079 5.3829 2.5 6.773 2.5 8.4c0 1.63385 0.579 3.02985 1.737 4.188 1.15785 1.158 2.55365 1.737 4.1875 1.737Zm-2.562 -6.7c0.20835 0 0.38335 -0.075 0.525 -0.225 0.14165 -0.15 0.2125 -0.32915 0.2125 -0.5375 0 -0.20835 -0.07185 -0.38335 -0.2155 -0.525 -0.14385 -0.14165 -0.322 -0.2125 -0.5345 -0.2125 -0.2 0 -0.375 0.07185 -0.525 0.2155 -0.15 0.14385 -0.225 0.322 -0.225 0.5345 0 0.2 0.075 0.375 0.225 0.525 0.15 0.15 0.32915 0.225 0.5375 0.225Zm2.5625 4.5c0.76 0 1.4369 -0.21325 2.03075 -0.63975 0.59365 -0.42665 1.0251 -0.97175 1.29425 -1.63525H5.1c0.26915 0.6635 0.7006 1.2086 1.29425 1.63525 0.59385 0.4265 1.27075 0.63975 2.03075 0.63975Zm2.5625 -4.5c0.20835 0 0.38335 -0.075 0.525 -0.225 0.14165 -0.15 0.2125 -0.32915 0.2125 -0.5375 0 -0.20835 -0.07185 -0.38335 -0.2155 -0.525 -0.14385 -0.14165 -0.322 -0.2125 -0.5345 -0.2125 -0.2 0 -0.375 0.07185 -0.525 0.2155 -0.15 0.14385 -0.225 0.322 -0.225 0.5345 0 0.2 0.075 0.375 0.225 0.525 0.15 0.15 0.32915 0.225 0.5375 0.225Z" strokeWidth="1.5"></path>
              </svg>
            </button>
            {languageModal && (
                <div className="absolute top-12 -right-20 language-container">
                    <div className="langugage-text-container">
                        <div className="language-text">
                            <div className="language-flag">🇬🇧</div>
                            <span>English</span>
                        </div>
                        <div className="language-text">
                            <div className="language-flag">🇮🇹</div>
                            <span>Italian</span>
                        </div>
                        <div className="language-text">
                            <div className="language-flag">🇪🇸</div>
                            <span>Spanish</span>
                        </div>
                    </div>
                </div>
            )}
          </div>
            <button className='bg-[#244ff9] rounded-[24px] w-[106px] h-[40px] flex items-center justify-center nav-bar-button'> <span className="nav-bar-text">Space Station</span></button>
            <button className='bg-white rounded-[24px]  w-[106px] h-[40px] flex justify-center items-center gap-2'>
                <span className='text-[#004FF8] nav-bar-text'>Login</span>
                <CgProfile color='#004FF8' size={20}/>
            </button>
        </div>
      <button onClick={() => setMenuModal(!menuModal)} className='sm:hidden bg-[#244ff9] rounded-[24px] p-2 w-[40px] h-[40px]'>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
          <path fill="white" d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
      </button>
      {menuModal && (
        <div className="absolute top-[72px] left-0 w-full bg-black/50">
          <div className="bg-[#303131] p-4 rounded-lg shadow-lg w-full flex flex-col items-start justify-center gap-4">
            <div className="w-full px-2 flex flex-col gap-4 text-white items-end">
                <span className="text-md">Login</span>
                <span className="text-md">Sign Up</span>
                <div className="border-t border-[#414141] w-full"></div>
                <span className="text-md text-[#949495]">Language</span>
                <span className="text-md">English</span>
                <span className="text-md">Spanish</span>
                <span className="text-md">Italian</span>
                <div className="border-t border-[#414141] w-full"></div>
                <span className="text-md text-[#949495]">Try for free</span>
                <span className="text-md">Space Station</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar