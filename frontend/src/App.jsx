import Add from './components/adduser';

import EventCards from './components/info'
import Login from './components/login' 
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InfoDeep from './components/info-deep';


//import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/cards' element={<EventCards/>}/>
            <Route path='/add' element={<Add/>}/>
            <Route path='/info-deep/:id' element={<InfoDeep/>}/>
        </Routes>
    </BrowserRouter>
    
      
    </>
  )
}

export default App
