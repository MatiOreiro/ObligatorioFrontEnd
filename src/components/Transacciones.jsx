import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { guardarTransacciones } from '../features/transacciones.slice';
import { useSelector } from 'react-redux';
import api from '../data/api';
import Transaccion from './Transaccion';
import TransaccionModal from './TransaccionModal';
import TransaccionEditModal from './TransaccionEditModal';
import ConfirmDialog from './ConfirmDialog';
import TransaccionEditForm from './TransaccionEditForm';

const Transacciones = () => {
    const transacciones = useSelector(state => state.transacciones.lista);
    console.log("transas", transacciones);
    
    const [selected, setSelected] = useState(null)
    const [editItem, setEditItem] = useState(null)
    const dispatch = useDispatch();

    const handleDetails = (t) => {
        setSelected(t)
    }

    const handleClose = () => setSelected(null)

    // Placeholder edit/delete handlers — adapt to your app's logic
    const handleEdit = (t) => setEditItem(t)

    const [confirmDeleteItem, setConfirmDeleteItem] = useState(null)

    const handleDelete = (t) => setConfirmDeleteItem(t)

    const doDelete = (t) => {
        api.delete(`/transaccion/eliminar/${t._id}`)
            .then(() => api.get('/transaccion/filtrar'))
            .then(response => dispatch(guardarTransacciones(response.data.transacciones)))
            .catch(err => console.error('Error al eliminar', err))
            .finally(() => setConfirmDeleteItem(null))
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

            {editItem && (
                <TransaccionEditForm
                    _id={editItem._id}
                    tipo={editItem.tipo}
                    monto={editItem.monto}
                    categoria={editItem.categoria.nombre}
                    descripcion={editItem.descripcion}
                    handleEdit={setEditItem}
                />
            )}

            {confirmDeleteItem && (
                <ConfirmDialog
                    title="Eliminar transacción"
                    message={`¿Seguro que quieres eliminar la transacción de $${confirmDeleteItem.monto}? Esta acción no se puede deshacer.`}
                    confirmLabel="Eliminar"
                    cancelLabel="Cancelar"
                    onConfirm={() => doDelete(confirmDeleteItem)}
                    onCancel={() => setConfirmDeleteItem(null)}
                />
            )}
        </div>
    )
}

export default Transacciones