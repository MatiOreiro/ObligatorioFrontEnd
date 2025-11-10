import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../validators/auth.validators.js';
import api from '../data/api';
import { joiResolver } from '@hookform/resolvers/joi';

const Register = () => {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(registerSchema) 
    })

    useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                navigate('/dashboard');
            }
        }, [])

    const onSubmit = (data) => {
        api.post('/auth/register', data)
            .then(response => {
                console.log('Registro exitoso:', response.data);
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            })
            .catch(error => {
                console.error('Error en el registro:', error);
            });
    }

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

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label htmlFor="registerUser">Usuario</label>
                        <input type="text" id='registerUser' placeholder="Usuario" {...register("username")} />
                    </div>

                    <div className="field">
                        <label htmlFor="registerEmail">Email</label>
                        <input type="email" id='registerEmail' placeholder="correo@ejemplo.com" {...register("email")} />
                    </div>

                    <div className="field">
                        <label htmlFor="registerPassword">Contraseña</label>
                        <input type="password" id='registerPassword' placeholder="••••••••" {...register("password")} />
                    </div>

                    <div className="field">
                        <label htmlFor="registerConfirmPassword">Repetir Contraseña</label>
                        <input type="password" id='registerConfirmPassword' placeholder="••••••••" {...register("confirmPassword")} />
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