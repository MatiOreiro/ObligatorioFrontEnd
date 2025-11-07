import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { guardarTransacciones } from '../features/transacciones.slice';
import { useSelector } from 'react-redux';
import api from '../data/api';
import Transaccion from './Transaccion';
import TransaccionModal from './TransaccionModal';

const Transacciones = () => {
    const transacciones = useSelector(state => state.transacciones.lista);
    const [selected, setSelected] = useState(null)

    const handleDetails = (t) => {
        setSelected(t)
    }

    const handleClose = () => setSelected(null)

    // Placeholder edit/delete handlers — adapt to your app's logic
    const handleEdit = (t) => {
        // e.g., navigate to edit form or open edit modal
        console.log('Editar', t)
    }

    const handleDelete = (t) => {
        // e.g., dispatch delete action or call API
        console.log('Eliminar', t)
    }

    return (
        <div>
            <h2>Transacciones</h2>
            <ul>
                {transacciones.map(transaccion => (
                    <li key={transaccion._id}>
                        <Transaccion transaccion={transaccion} onDetails={handleDetails} onEdit={handleEdit} onDelete={handleDelete} />
                    </li>
                ))}
            </ul>

            {selected && (
                <TransaccionModal transaccion={selected} onClose={handleClose} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    )
}

export default Transacciones