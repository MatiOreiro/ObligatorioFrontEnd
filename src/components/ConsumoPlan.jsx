import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

const ConsumoPlan = () => {
    const { t } = useTranslation();
    const cantidadTransacciones = useSelector(state => state.transacciones.lista.length);
    const plan = useSelector(state => state.usuario.plan);

    return (
        <div>
            <h3>{t('accounts.usage')}</h3>
            {plan.tipo === 'plus' && (
                <progress value={cantidadTransacciones} max={plan.limiteTransacciones} />
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