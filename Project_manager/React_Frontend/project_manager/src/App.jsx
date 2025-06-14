import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
// import AdminPanel from './Components/AdminPanel/AdminPanel'
import Adminpanel from './Components/Adminpanel'

import { ThemeProvider } from './Context/ThemeContext';

function App() {

  const [currentProject, setcurrentProject] = useState(null);

  return (
    <>
      <ThemeProvider>
        <Navbar currentProject={currentProject} />
        <Adminpanel currentProject={currentProject} setcurrentProject={setcurrentProject} />
      </ThemeProvider>
    </>
  )
}

export default App
