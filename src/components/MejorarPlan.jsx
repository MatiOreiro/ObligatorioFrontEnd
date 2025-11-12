import React from 'react'
import api from '../data/api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const MejorarPlan = () => {
    const { t } = useTranslation();

    const handleActualizarPlan = () => {
        api.patch('/usuario/alternar-plan/')
            .then(response => {
                console.log('Plan actualizado:', response.data);
                localStorage.setItem('token', response.data.token);
            })
            .catch(error => {
                console.error('Error al actualizar el plan:', error);
            });
    }

    return (
        <>
            <button onClick={handleActualizarPlan}>{t('buttons.planUpdate')}</button>
        </>
    )
}

export default MejorarPlan