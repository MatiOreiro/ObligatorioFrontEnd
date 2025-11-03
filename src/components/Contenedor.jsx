import React from 'react'
import { Outlet } from 'react-router'

const Contenedor = () => {
    return (
        <>
            <div className="contenedor">
                <h1>Contenedor Component</h1>

            </div>
            <Outlet />
        </>
    )
}

export default Contenedor