import React, { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router'
import BurgerMenu from './BurgerMenu'
import { useDispatch } from 'react-redux';
import { limpiarTransacciones } from '../features/transacciones.slice';
import { limpiarCuentas } from '../features/usuario.slice';
import { useTranslation } from 'react-i18next';
import i18n from "../i18n"
import ImagenPerfil from './ImagenPerfil';


const Contenedor = () => {

    const loggeado = localStorage.getItem('token') !== null;

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.clear();
        dispatch(limpiarTransacciones());
        dispatch(limpiarCuentas());
        navigate('/');
    }

    const cambiarIdioma = e => {
        const nuevoIdioma = e.target.value;
        i18n.changeLanguage(nuevoIdioma);
    }

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
            <div className="contenedor">
                <button className="burger-toggle icon-btn btn-ghost" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>☰</button>
                <select onChange={cambiarIdioma} defaultValue={i18n.language} className="language-select" >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="ko">한국어</option>
                </select>
                <h1>{t('name')}</h1>
                {loggeado && (
                    <div className="right-controls">
                        <ImagenPerfil />
                        <button className="btn-logout" title='cerrarSesion' onClick={handleLogout}>{t('logout')}</button>
                    </div>
                )}
            </div>
            <Outlet />
        </>
    )
}

export default Contenedor