import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// options are built per-render so we can translate titles via i18n inside the component

export default function App() {
    const { t } = useTranslation();
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: t('graphs.last7Income') },
        },
    };
// obtener las ultimas 7 transacciones del estado
    const transacciones = useSelector((state) => state.transacciones.lista);
    const ingresos = transacciones.filter(t => t.tipo === 'ingreso').slice(-7);
    /* const egresos = transacciones.filter(t => t.tipo === 'egreso').slice(-7); */

    // convertir fecha a short date string
    const labels = [...ingresos.map(t => new Date(t.fecha).toLocaleDateString())];

    const data = {
        labels,
        datasets: [
            {
                label: t('graphs.incomes'),
                data: ingresos.map(transaccion => transaccion.monto),
                borderColor: 'rgb(40, 167, 69)', // verde para ingresos
                backgroundColor: 'rgba(40, 167, 69, 0.5)',
            },
/*             {
                label: 'Egresos',
                data: egresos.map(transaccion => transaccion.monto),
                borderColor: 'rgb(220, 53, 69)', // rojo para egresos
                backgroundColor: 'rgba(220, 53, 69, 0.5)',
            }, */
        ],
    };

    return <Line options={options} data={data} />;
}
