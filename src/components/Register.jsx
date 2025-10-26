import React from 'react'

const Register = () => {
  return (
    <div className="register">
        <h2>Registro</h2>
        <form>
            <div>
                <label htmlFor="registerUser">Usuario:</label>
                <input type="text" id='registerUser'/>
            </div>
            <div>
                <label htmlFor="registerEmail">Email:</label>
                <input type="email" id='registerEmail'/>
            </div>
            <div>
                <label htmlFor="registerPassword">Contraseña:</label>
                <input type="password" id='registerPassword'/>
            </div>
            <div>
                <label htmlFor="registerConfirmPassword">Repetir Contraseña:</label>
                <input type="password" id='registerConfirmPassword'/>
            </div>
            <button type="submit">Registrarse</button>
        </form>
    </div>
  )
}

export default Register