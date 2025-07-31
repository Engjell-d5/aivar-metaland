import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import AuthCallback from './components/AuthCallback'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col overflow-hidden">
          <div className="fixed-header">
            <NavBar />
          </div>
          
          <main className="flex-grow flex pt-[72px] overflow-hidden"> {/* Add overflow-hidden */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/callback" element={<AuthCallback />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
