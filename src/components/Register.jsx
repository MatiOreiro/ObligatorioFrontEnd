import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../validators/auth.validators.js';
import api from '../data/api';
import { joiResolver } from '@hookform/resolvers/joi';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Register = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: joiResolver(registerSchema),
        mode: 'onChange'
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
                toast.success(t('toasts.registerSuccess'));
            })
            .catch(error => {
                console.error('Error en el registro:', error);
                toast.error(t('toasts.registerError'));
            });
    }

    return (
        <div className="auth-container">
            <div className="login-card" role="region" aria-labelledby="register-title">
                <div className="brand">
                    <div className="logo-placeholder" aria-hidden="true"></div>
                    <div>
                        <h2 id="register-title">{t('register.title')}</h2>
                        <p className="lead">{t('register.welcome')}</p>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label htmlFor="registerUser">{t('username')}</label>
                        <input type="text" id='registerUser' placeholder="abcd1234" {...register("username")} />
                        {errors.username && <span className="error-message" role="alert">{errors.username.message}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="registerEmail">{t('register.email')}</label>
                        <input type="email" id='registerEmail' placeholder="correo@example.com" {...register("email")} />
                        {errors.email && <span className="error-message" role="alert">{errors.email.message}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="registerPassword">{t('password')}</label>
                        <input type="password" id='registerPassword' placeholder="••••••••" {...register("password")} />
                        {errors.password && <span className="error-message" role="alert">{errors.password.message}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="registerConfirmPassword">{t('register.confirmPassword')}</label>
                        <input type="password" id='registerConfirmPassword' placeholder="••••••••" {...register("confirmPassword")} />
                        {errors.confirmPassword && <span className="error-message" role="alert">{errors.confirmPassword.message}</span>}
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={!isValid}>{t('register.submit')}</button>
                        <Link to="/" className="secondary-link" aria-label={t('register.backToLogin')}>{t('register.backToLogin')}</Link>
                    </div>

                    <div className="login-note">{t('register.termsAndConditions')}</div>
                </form>
            </div>
        </div>
    )
}

export default Register