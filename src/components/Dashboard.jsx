import React from 'react'
import Transacciones from './Transacciones'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { guardarTransacciones } from '../features/transacciones.slice';
import api from '../data/api';
import LineChart from './dashboard/LineChart';
import LineChartEgresos from './dashboard/LineChartEgresos';
import PieChartEgresos from './dashboard/PieChartEgresos';
import CrearTransaccionForm from './CrearTransaccionForm';
import MejorarPlan from './MejorarPlan';

const Dashboard = () => {
    const token = localStorage.getItem('token');

    const dispatch = useDispatch();

    useEffect(() => {
        // re-run when token changes. If there's no token yet, skip the request.
        if (!token) return;

        cargarTransacciones();
    }, []);

    const cargarTransacciones = () => {
        api.get('/transaccion/filtrar')
            .then(response => {
                console.log('Transacciones cargadas:', response.data);
                dispatch(guardarTransacciones(response.data.transacciones));

            })
            .catch(error => {
                console.error('Error al cargar transacciones:', error);
            });
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <MejorarPlan />
            <CrearTransaccionForm />
            <PieChartEgresos />
            <LineChart />
            <LineChartEgresos />
            <Transacciones />
        </div>
    )
}

export default Dashboard