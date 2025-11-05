import React from 'react'

const Transaccion = ({ transaccion }) => {

const fecha = new Date(transaccion.fecha).toLocaleDateString()

return (
    <div>
        <strong>{transaccion.tipo}</strong> — ${transaccion.monto} • {fecha}
        <div>
            {transaccion.categoria.nombre}
            {transaccion.descripcion ? ` — ${transaccion.descripcion}` : ''}
        </div>
    </div>
)
}

export default Transaccion