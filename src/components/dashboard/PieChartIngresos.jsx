import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

// options will be created inside the component to allow translations via i18n

export default function App() {
    const { t } = useTranslation();
    const transacciones = useSelector((state) => state.transacciones.lista);
    const ingresos = transacciones.filter(t => t.tipo === 'ingreso');
    const totalesPorCategoria = ingresos.reduce((acc, t) => {
        const categoria = t.categoria.nombre;
        if (!acc[categoria]) {
            acc[categoria] = 0;
        }
        acc[categoria] += t.monto;
        return acc;
    }, {});

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: t('graphs.incomeByCategory') },
        },
    };

    const data = {
        labels: Object.keys(totalesPorCategoria),
        datasets: [
            {
                label: t('income'),
                data: [...Object.values(totalesPorCategoria)],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Pie options={options} data={data} />;
}
