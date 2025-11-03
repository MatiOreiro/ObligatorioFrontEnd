import React from 'react'
import { Link } from 'react-router';

const Register = () => {
    return (
        <div className="auth-container">
            <div className="login-card" role="region" aria-labelledby="register-title">
                <div className="brand">
                    <div className="logo-placeholder" aria-hidden="true"></div>
                    <div>
                        <h2 id="register-title">Crear cuenta</h2>
                        <p className="lead">Regístrate para comenzar a usar la app</p>
                    </div>
                </div>

                <form className="login-form">
                    <div className="field">
                        <label htmlFor="registerUser">Usuario</label>
                        <input type="text" id='registerUser' name="username" placeholder="Usuario" />
                    </div>

                    <div className="field">
                        <label htmlFor="registerEmail">Email</label>
                        <input type="email" id='registerEmail' name="email" placeholder="correo@ejemplo.com" />
                    </div>

                    <div className="field">
                        <label htmlFor="registerPassword">Contraseña</label>
                        <input type="password" id='registerPassword' name="password" placeholder="••••••••" />
                    </div>

                    <div className="field">
                        <label htmlFor="registerConfirmPassword">Repetir Contraseña</label>
                        <input type="password" id='registerConfirmPassword' name="confirmPassword" placeholder="••••••••" />
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit">Registrarse</button>
                        <Link to="/" className="secondary-link" aria-label="Volver a iniciar sesión">Volver a iniciar sesión</Link>
                    </div>

                    <div className="login-note">Al registrarte aceptas los términos y condiciones.</div>
                </form>
            </div>
        </div>
    )
}

export default Register