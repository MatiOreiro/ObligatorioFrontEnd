import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { guardarTransacciones } from '../features/transacciones.slice';
import { useSelector } from 'react-redux';

const Transacciones = () => {

    const dispatch = useDispatch();

    const token = useSelector(state => state.usuario.token);

    useEffect(() => {
        // re-run when token changes. If there's no token yet, skip the request.
        if (!token) return;

        cargarTransacciones();
    }, [token]);


    const cargarTransacciones = () => {
        axios.get('http://localhost:3000/v1/transaccion/filtrar', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                console.log('Transacciones cargadas:', response.data);
                dispatch(guardarTransacciones(response.data));
            })
            .catch(error => {
                console.error('Error al cargar transacciones:', error);
            });
    }

    return (
        <div>Transacciones</div>
    )
}

export default Transacciones