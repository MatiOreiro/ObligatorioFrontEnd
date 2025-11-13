import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next';
import api from '../data/api';
import { mejorarPlan } from '../features/usuario.slice';
import { toast } from 'react-toastify';

const ConsumoPlan = () => {
    const { t } = useTranslation();
    const cantidadTransacciones = useSelector(state => state.transacciones.lista.length);
    const plan = useSelector(state => state.usuario.plan);
    const dispatch = useDispatch();

    const handleActualizarPlan = () => {
        api.patch('/usuario/alternar-plan/')
            .then(response => {
                console.log('Plan actualizado:', response.data);
                dispatch(mejorarPlan());
                if (response.data.token) localStorage.setItem('token', response.data.token);
                toast.success(t('toasts.planUpdated'));
            })
            .catch(error => {
                console.error('Error al actualizar el plan:', error);
                toast.error(t('toasts.planUpdateError'));
            });
    }

    return (
        <div className="consumo-plan">
            <h3>{t('accounts.usage')}</h3>
            {plan.tipo === 'plus' && (
                <>
                  <progress value={cantidadTransacciones} max={plan.limiteTransacciones} />
                  <div className="mt-3">
                    <button className="btn--secondary" onClick={handleActualizarPlan}>{t('buttons.planUpdate')}</button>
                  </div>
                </>
            )}
            {plan.tipo === 'premium' && (
                <>
                <progress value={1} max={1} />
                <p>{t('accounts.premium')}</p>
                </>
            )}
        </div>
    )
}

export default ConsumoPlan