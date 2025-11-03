import { useState } from 'react'
import Login from "./Login"
import Register from "./Register"

const Acceso = () => {
  const [mode, setMode] = useState('login') // 'login' | 'register'

  return (
    <div className="acceso">
      {mode === 'login' && (
        <Login onSwitchToRegister={() => setMode('register')} />
      )}

      {mode === 'register' && (
        <Register onSwitchToLogin={() => setMode('login')} />
      )}
    </div>
  )
}

export default Acceso