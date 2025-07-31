import { CgProfile } from 'react-icons/cg'
import { motion } from 'framer-motion'

export const getSignUpSection = (isMobile: boolean, gpuStyles: React.CSSProperties) => {
  const handleSignUp = () => {
    // Placeholder for sign-up logic
    console.log('Sign Up button clicked')
  }

  const mobileContent = (
    <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row6m" style={gpuStyles}>
      <div className="p-5" style={{ marginTop: '-10%', textAlign: 'center' }}>
        <span style={{ color: '#FFF', fontFamily: 'Figtree', fontSize: '24px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal' }}>
          <b>Entra nella community</b> che sta ridefinendo <br /> il <b>futuro dell'AI</b>: condividi conoscenze, <br />
          costruisci connessioni, <b>trasforma le tue</b> <br /> <b>idee in realtà.</b>
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '32px' }}>
          <button
            onClick={handleSignUp}
            style={{ background: '#fff', color: '#2563eb', fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: '1.25rem', borderRadius: '9999px', padding: '12px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', outline: 'none', transition: 'box-shadow 0.2s' }}
          >
            Registrati
            <CgProfile color="#004FF8" size={22} className="login-button-icon" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  const desktopContent = (
    <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row5" style={gpuStyles}>
      <div className="p-5" style={{ marginTop: '-10%', textAlign: 'center' }}>
        <span style={{ color: '#FFF', fontFamily: 'Figtree', fontSize: '40px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal' }}>
          <b>Entra nella community</b> che sta ridefinendo <br /> il <b>futuro dell'AI</b>: condividi conoscenze, <br />
          costruisci connessioni, <b>trasforma le tue</b> <br /> <b>idee in realtà.</b>
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '32px' }}>
          <button
            onClick={handleSignUp}
            style={{ background: '#fff', color: '#2563eb', fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: '1.25rem', borderRadius: '9999px', padding: '12px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', outline: 'none', transition: 'box-shadow 0.2s' }}
          >
            Registrati
            <CgProfile color="#004FF8" size={22} className="login-button-icon" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  return isMobile ? mobileContent : desktopContent
} 