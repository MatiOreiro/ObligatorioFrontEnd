import { useState } from 'react'
import './App.css'
import Acceso from './components/Acceso'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './components/Login'
import Register from './components/Register'
import NoEncontrado from './components/NoEncontrado'
import Contenedor from './components/Contenedor'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import Transacciones from './components/Transacciones'
import { ToastContainer, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Contenedor />}>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<ProtectedRoute />} >
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
          <Route path='/transacciones' element={<ProtectedRoute />} >
            <Route path='/transacciones' element={<Transacciones />} />
          </Route>
          <Route path='*' element={<NoEncontrado />} />
        </Route>
      </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </Provider>
  );
}

export default App;
