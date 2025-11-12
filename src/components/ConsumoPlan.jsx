import React from 'react'
import { useSelector } from 'react-redux'

const ConsumoPlan = () => {
    const cantidadTransacciones = useSelector(state => state.transacciones.lista.length);
    const plan = useSelector(state => state.usuario.plan);

    return (
        <div>
            <h3>Consumo Plan</h3>
            {plan.tipo === 'plus' && (
                <progress value={cantidadTransacciones} max={plan.limiteTransacciones} />
            )}
            {plan.tipo === 'premium' && (
                <>
                <progress value={1} max={1} />
                <p>Transacciones ilimitadas con el plan Premium</p>
                </>
            )}
        </div>
    )
}

export default ConsumoPlan