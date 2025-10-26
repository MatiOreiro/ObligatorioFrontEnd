import { useState } from 'react'
import './App.css'
import Acceso from './components/Acceso'
import { Provider } from 'react-redux'
import { store } from './store/store'

function App() {

  return (
    <Provider store={store}>
      <Acceso />
    </Provider>
  )
}

export default App
