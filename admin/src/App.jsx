import Add from './components/adduser';
import EventCards from './components/info';
import Login from './components/login';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Items from './components/items';
import Stats from './components/stats';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InfoDeep from './components/info-deep';
import EditAccess from './components/editaccess';
//import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route 
              path='/cards' 
              element={
                <ProtectedRoute>
                  <EventCards/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/add' 
              element={
                <ProtectedRoute>
                  <Add/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/items' 
              element={
                <ProtectedRoute>
                  <Items/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/stats' 
              element={
                <ProtectedRoute>
                  <Stats/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/info-deep/:id' 
              element={
                <ProtectedRoute>
                  <InfoDeep/>
                </ProtectedRoute>
              }
            />
              <Route 
                path='/edit-access' 
                element={<EditAccess />} 
              />
            {/* Redirect root to login */}
            <Route path='/' element={<Navigate to="/login" replace />}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App
