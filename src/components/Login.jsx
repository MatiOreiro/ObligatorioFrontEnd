import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import api from '../data/api';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { loginSchema } from '../validators/auth.validators.js';
import { useDispatch } from 'react-redux';
import { guardarCuentas } from '../features/usuario.slice';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(loginSchema)
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [])

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
                navigate('/dashboard');
                toast.success(t('toasts.loginSuccess'));
            }
            ).catch(error => {
                console.error("Login error:", error);
                toast.error(t('toasts.loginError'));
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
                        <h2 id="login-title">{t('login.title')}</h2>
                        <p className="lead">{t('login.welcome')}</p>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label htmlFor="loginUser">{t('username')}</label>
                        <input id="loginUser" type="text" placeholder="abcd1234" {...register("username")} />
                        {errors.username && <span className="error-message" role="alert">{errors.username.message}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="loginPassword">{t('password')}</label>
                        <input id="loginPassword" type="password" placeholder="••••••••" {...register("password")} />
                        {errors.password && <span className="error-message" role="alert">{errors.password.message}</span>}
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={loading}>{loading ? t('login.submit') + '…' : t('login.submit')}</button>
                        <Link to="/register" className="secondary-link" aria-label={t('login.register')}>{t('login.register')}</Link>
                    </div>

                    <div className="login-note">{t('login.forgotPassword')}</div>
                </form>
            </div>
        </div>
    )
}

export default Login