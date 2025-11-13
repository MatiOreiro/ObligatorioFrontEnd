import React from 'react'
import api from '../data/api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useDispatch } from 'react-redux';
import { mejorarPlan } from '../features/usuario.slice';

const MejorarPlan = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleActualizarPlan = () => {
        api.patch('/usuario/alternar-plan/')
            .then(response => {
                console.log('Plan actualizado:', response.data);
                dispatch(mejorarPlan());
                localStorage.setItem('token', response.data.token);
            })
            .catch(error => {
                console.error('Error al actualizar el plan:', error);
            });
    }

    return (
        <div className="mejorar-plan">
            <button className="btn--secondary" onClick={handleActualizarPlan}>{t('buttons.planUpdate')}</button>
        </div>
    )
}

export default MejorarPlan