import React from 'react'
import api from '../data/api';

const MejorarPlan = () => {
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
            <button onClick={handleActualizarPlan}>Actualizar Plan</button>
        </>
    )
}

export default MejorarPlan