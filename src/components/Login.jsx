import React from 'react'

const Login = () => {
  return (
    <div className="login">
        <h2>Iniciar sesión</h2>
        <form>
            <div>
                <label htmlFor="loginUser">Usuario:</label>
                <input type="text" id='loginUser'/>
            </div>
            <div>
                <label htmlFor="loginPassword">Contraseña:</label>
                <input type="password" id='loginPassword'/>
            </div>

            <button type="submit">Iniciar sesión</button>
        </form>
    </div>
  )
}

export default Login