import { useState } from 'react'
import './App.css'
import Acceso from './components/Acceso'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Transacciones from './components/Transacciones'

function App() {

  return (
    <Provider store={store}>
      <Acceso />
      <Transacciones />
    </Provider>
  )
}

export default App
