import React from 'react'
import { Outlet, useNavigate } from 'react-router'

const Contenedor = () => {

    const loggeado = localStorage.getItem('token') !== null;

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <>
            <div className="contenedor">
                <h1>Contenedor Component</h1>
                {loggeado && (<button className="btn-logout" title='cerrarSesion' onClick={handleLogout}>Logout</button>)}
            </div>
            <Outlet />
        </>
    )
}

export default Contenedor