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
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { guardarCuentas, guardarImagenPerfil } from '../features/usuario.slice';
import CambiarImagenPerfil from './CambiarImagenPerfil';
import { useSelector } from 'react-redux';
import { guardarSaldo1, guardarSaldo2 } from '../features/usuario.slice';
import Saldo from './Saldo';
import UltimasTransaccionesCuenta from './UltimasTransaccionesCuenta';
import ConsumoPlan from './ConsumoPlan';

const Dashboard = () => {
    const token = localStorage.getItem('token');
    const { t } = useTranslation();

    const [saldosCargados, setSaldosCargados] = useState(false);
    const [cuentasCargadas, setCuentasCargadas] = useState(false);
    const [transaccionesCargadas, setTransaccionesCargadas] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        // re-run when token changes. If there's no token yet, skip the request.
        if (!token) return;

        obtenerCuentas();
        cargarTransacciones();
        obtenerImagenPerfil();
    }, []);

    const cargarTransacciones = () => {
        api.get('/transaccion/filtrar')
            .then(response => {
                console.log('Transacciones cargadas:', response.data);
                dispatch(guardarTransacciones(response.data.transacciones));
                setTransaccionesCargadas(true);
            })
            .catch(error => {
                console.error('Error al cargar transacciones:', error);
            });
    }

    const obtenerCuentas = () => {
        api.get('/cuenta/')
            .then(response => {
                console.log('Cuentas obtenidas:', response.data);
                obtenerSaldos(response.data.cuentas);
                dispatch(guardarCuentas(response.data.cuentas));
                setCuentasCargadas(true);
            })
            .catch(error => {
                console.error('Error al obtener cuentas:', error);
            });
    }

    const obtenerImagenPerfil = () => {
        api.get('/usuario/obtener-imagen')
            .then(response => {
                if (response.data.imagenPerfil !== "") {
                    console.log('Imagen de perfil obtenida:', response.data);
                    dispatch(guardarImagenPerfil(response.data.imagenPerfil));
                }
            })
            .catch(error => {
                console.error('Error al obtener imagen de perfil:', error);
            });
    }

    const cuentas = useSelector(state => state.usuario.cuentas);
    const saldoCuenta1 = useSelector(state => state.usuario.saldoCuenta1);
    const saldoCuenta2 = useSelector(state => state.usuario.saldoCuenta2);

    const obtenerSaldos = (cuentas) => {
        api.get(`/cuenta/${cuentas[0]._id}`)
            .then(response => {
                dispatch(guardarSaldo1(response.data.cuenta.saldo));
                setSaldosCargados(true);
            })
            .catch(error => {
                console.error('Error al obtener saldo de la cuenta 1:', error);
            });

        api.get(`/cuenta/${cuentas[1]._id}`)
            .then(response => {
                dispatch(guardarSaldo2(response.data.cuenta.saldo));
            })
            .catch(error => {
                console.error('Error al obtener saldo de la cuenta 2:', error);
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
                        <svg className="btn-add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z" fill="currentColor" /></svg>
                        <span>{t('buttons.addTransaction')}</span>
                    </span>
                </button>
            </div>
            <CambiarImagenPerfil />
            <CrearTransaccionModal open={openCreate} onClose={closeCrear} />
            <MejorarPlan />
            <ConsumoPlan />
            {saldosCargados && (
                <>
                    <Saldo titulo={cuentas[0].nombre} saldo={saldoCuenta1} />
                    <Saldo titulo={cuentas[1].nombre} saldo={saldoCuenta2} />
                </>
            )}
            <PieChartEgresos />
            <LineChart />
            <LineChartEgresos />
            {(cuentasCargadas && transaccionesCargadas) && (
                <div>
                    <UltimasTransaccionesCuenta cuentaId={cuentas[0]._id} />
                    <UltimasTransaccionesCuenta cuentaId={cuentas[1]._id} />
                </div>
            )}
            {/* <Transacciones /> */}
        </div>
    )
}

export default Dashboard