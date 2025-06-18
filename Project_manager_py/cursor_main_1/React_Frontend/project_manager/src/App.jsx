import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Adminpanel from './Components/Adminpanel'
import { ThemeProvider } from './Context/ThemeContext';

function App() {
  const [currentProject, setcurrentProject] = useState(null);

  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar currentProject={currentProject} />
        <Adminpanel currentProject={currentProject} setcurrentProject={setcurrentProject} />
      </div>
    </ThemeProvider>
  )
}

export default App
