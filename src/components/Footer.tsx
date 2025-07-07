import logo from '../assets/Logo.png'
import './Footer.css'

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-main-section">
          <img src={logo} alt="logo" className="footer-logo" />
          <div className="footer-company-info">
            <span className="footer-big-text">AIVAR INTL TECHNOLOGIES LIMITED</span>
            <span className="footer-small-text">63-66 Hatton Garden</span>
            <span className="footer-small-text">London, England, EC1N 8LE</span>
          </div>  
        </div>

        <div className="footer-divider" />

        <div className="footer-policy-section">
          <span className="policy-text">Privacy Policy</span>
        </div>
      </div>
    </div>
  )
}

export default Footer