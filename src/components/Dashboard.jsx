import Transacciones from './Transacciones'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { guardarTransacciones } from '../features/transacciones.slice';
import api from '../data/api';
import LineChart from './dashboard/LineChart';
import LineChartEgresos from './dashboard/LineChartEgresos';
import PieChartEgresos from './dashboard/PieChartEgresos';
import CrearTransaccionModal from './CrearTransaccionModal';
import MejorarPlan from './MejorarPlan';
import { guardarCuentas } from '../features/usuario.slice';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Dashboard = () => {
    const token = localStorage.getItem('token');
    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        // re-run when token changes. If there's no token yet, skip the request.
        if (!token) return;

        obtenerCuentas();
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

    const obtenerCuentas = () => {
        api.get('/cuenta/')
            .then(response => {
                console.log('Cuentas obtenidas:', response.data);
                dispatch(guardarCuentas(response.data.cuentas));
            })
            .catch(error => {
                console.error('Error al obtener cuentas:', error);
            });
    }

    const [openCreate, setOpenCreate] = useState(false);

    const openCrear = () => setOpenCreate(true);
    const closeCrear = () => setOpenCreate(false);

    return (
        <div>
            <div className="dashboard-header">
                <h2 className="dashboard-title">{t("dashboard")}</h2>
                <button className="btn-add" onClick={openCrear} aria-haspopup="dialog" aria-expanded={openCreate}>
                    <span className="btn-add-content">
                        <svg className="btn-add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z" fill="currentColor"/></svg>
                        <span>{t('buttons.addTransaction')}</span>
                    </span>
                </button>
            </div>
            <CrearTransaccionModal open={openCreate} onClose={closeCrear} />
            <MejorarPlan />
            <PieChartEgresos />
            <LineChart />
            <LineChartEgresos />
            <Transacciones />
        </div>
    )
}

export default Dashboard