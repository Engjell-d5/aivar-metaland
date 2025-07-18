import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <div className="fixed-header">
          <NavBar />
        </div>
        
        <main className="flex-grow flex pt-[72px] overflow-hidden"> {/* Add overflow-hidden */}
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
