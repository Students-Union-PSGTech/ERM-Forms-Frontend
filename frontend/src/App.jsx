import EventCards from './components/info'
import Login from './components/login' 
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


//import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path='login' element={<Login/>}/>
            <Route path='cards' element={<EventCards/>}/>
        </Routes>
    </BrowserRouter>
    
      
    </>
  )
}

export default App
