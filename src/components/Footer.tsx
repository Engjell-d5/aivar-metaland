import logo from '../assets/Logo.png';

const Footer = () => {
    return (
        <div className="bg-[#262627] w-full h-[208px]">
            <div className="flex flex-col justify-center  p-8 gap-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <img src={logo} alt="logo" className="w-[225px] h-[80px] mx-0" />
                    <div className="flex flex-col items-end text-white w-full sm:w-auto">
                        <span className="footer-big-text">AIVAR INTL TECHNOLOGIES LIMITED</span>
                        <span className="footer-small-text">63-66 Hatton Garden</span>
                        <span className="footer-small-text">London, England, EC1N 8LE</span>
                    </div>  
                </div>

                <div 
                    className="w-full h-[1px]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(to right, white 0px, white 8px, transparent 8px, transparent 16px)'
                    }}
                ></div>

                <div className="w-full flex items-center justify-end">
                    <span className="policy-text">Privacy Policy</span>
                </div>
            </div>
        </div>
    )
}

export default Footer