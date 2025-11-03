import { useState } from 'react'
import { Link } from 'react-router';
import api from '../data/api';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { loginSchema } from '../validators/auth.validators.js';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(loginSchema)
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = (data) => {
        setLoading(true);
        console.log("on submit data", data);


        api.post('/auth/login', {
            username: data.username,
            password: data.password
        })
            .then(response => {
                console.log("Login successful:", response.data);
                localStorage.setItem('token', response.data.token);
                
            }
            ).catch(error => {
                console.error("Login error:", error);
                // Handle login error (e.g., show error message)
            })
            .finally(() => {
                setLoading(false);
            });
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

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label htmlFor="loginUser">Usuario</label>
                        <input id="loginUser" type="text" placeholder="Usuario" {...register("username")} />
                        {errors.username && <span className="error-message" role="alert">{errors.username.message}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="loginPassword">Contraseña</label>
                        <input id="loginPassword" type="password" placeholder="••••••••" {...register("password")} />
                        {errors.password && <span className="error-message" role="alert">{errors.password.message}</span>}
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Iniciar sesión'}</button>
                        <Link to="/register" className="secondary-link" aria-label="Crear una cuenta">Crear una cuenta</Link>
                    </div>

                    <div className="login-note">¿Problemas para entrar? Contacta al administrador.</div>
                </form>
            </div>
        </div>
    )
}

export default Login