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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Egresos en los últimos 7 días',
        },
    },
};

export default function App() {
    // obtener las ultimas 7 transacciones del estado
    const transacciones = useSelector((state) => state.transacciones.lista);
    /*     const ingresos = transacciones.filter(t => t.tipo === 'ingreso').slice(-7); */
    const egresos = transacciones.filter(t => t.tipo === 'egreso').slice(-7);

    // convertir fecha a short date string
    const labels = [...egresos.map(t => new Date(t.fecha).toLocaleDateString())];

    const data = {
        labels,
        datasets: [
            /* {
                label: 'Ingresos',
                data: ingresos.map(transaccion => transaccion.monto),
                borderColor: 'rgb(40, 167, 69)', // verde para ingresos
                backgroundColor: 'rgba(40, 167, 69, 0.5)',
            }, */
            {
                label: 'Egresos',
                data: egresos.map(transaccion => transaccion.monto),
                borderColor: 'rgb(220, 53, 69)', // rojo para egresos
                backgroundColor: 'rgba(220, 53, 69, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />;
}
