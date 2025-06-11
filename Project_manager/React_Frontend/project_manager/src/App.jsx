import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
// import AdminPanel from './Components/AdminPanel/AdminPanel'
import Adminpanel from './Components/Adminpanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Adminpanel/>
    </>
  )
}

export default App
