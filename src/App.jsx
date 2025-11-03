import { useState } from 'react'
import './App.css'
import Acceso from './components/Acceso'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Transacciones from './components/Transacciones'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './components/Login'
import Register from './components/Register'
import NoEncontrado from './components/NoEncontrado'
import Contenedor from './components/Contenedor'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Contenedor />}>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/transacciones' element={<ProtectedRoute />} >
            <Route path='/transacciones' element={<Transacciones />} />
          </Route>
          <Route path='*' element={<NoEncontrado />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
