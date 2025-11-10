import React, { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router'
import BurgerMenu from './BurgerMenu'
import { useDispatch } from 'react-redux';
import { limpiarTransacciones } from '../features/transacciones.slice';
import { limpiarCuentas } from '../features/usuario.slice';

const Contenedor = () => {

    const loggeado = localStorage.getItem('token') !== null;

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.clear();
        dispatch(limpiarTransacciones());
        dispatch(limpiarCuentas());
        navigate('/');
    }

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="contenedor">
                <button className="burger-toggle icon-btn btn-ghost" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>☰</button>
                <h1>Contenedor Component</h1>
                {loggeado && (<button className="btn-logout" title='cerrarSesion' onClick={handleLogout}>Logout</button>)}
            </div>
            <Outlet />
        </>
    )
}

export default Contenedor