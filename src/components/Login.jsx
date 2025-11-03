import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { guardarUsuario } from '../features/usuario.slice';

const Login = ({ onSwitchToRegister }) => {
    const dispatch = useDispatch();

    const userRef = useRef();
    const passwordRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/v1/auth/login', {
                username: userRef.current.value,
                password: passwordRef.current.value
            });
            // dispatch token (you may want to store user object instead)
            dispatch(guardarUsuario(response.data.token));
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError((err?.response?.data?.message) || 'No se pudo iniciar sesión. Verifique credenciales.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="login-card" role="region" aria-labelledby="login-title">
                <div className="brand">
                    <div className="logo-placeholder" aria-hidden="true"></div>
                    <div>
                        <h2 id="login-title">Iniciar sesión</h2>
                        <p className="lead">Accede a tu cuenta para ver y gestionar tus transacciones</p>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="loginUser">Usuario</label>
                        <input id="loginUser" name="username" type="text" ref={userRef} placeholder="Usuario" autoComplete="username" required />
                    </div>

                    <div className="field">
                        <label htmlFor="loginPassword">Contraseña</label>
                        <input id="loginPassword" name="password" type="password" ref={passwordRef} placeholder="••••••••" autoComplete="current-password" required />
                    </div>

                    {error && <div className="error" role="alert" aria-live="assertive">{error}</div>}

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Iniciar sesión'}</button>
                        <button type="button" className="secondary-link" onClick={onSwitchToRegister} aria-label="Crear cuenta">Crear cuenta</button>
                    </div>

                    <div className="login-note">¿Problemas para entrar? Contacta al administrador.</div>
                </form>
            </div>
        </div>
    )
}

export default Login