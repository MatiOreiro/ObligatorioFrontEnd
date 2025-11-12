import React, { useEffect, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import api from '../data/api'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { restarSaldo1, restarSaldo2, sumarSaldo1, sumarSaldo2 } from '../features/usuario.slice'
import TransaccionEditForm from './TransaccionEditForm'
import { actualizarTransaccion } from '../features/transacciones.slice'
import { ToastContainer, toast } from 'react-toastify'


const TransaccionEditModal = ({ _id, tipo, monto, categoria, descripcion, handleEdit, open, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pendingData, setPendingData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cuentas = useSelector(state => state.usuario.cuentas);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        }
        if (open) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const handleBackdrop = (e) => {
        // close only when clicking on overlay
        if (e.target.classList && e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    }

    const handleCreateAttempt = (data) => {
        setPendingData(data);
        setShowConfirm(true);
    }

    const handleConfirm = () => {
        if (!pendingData) return;
        setShowConfirm(false);
        setLoading(true);
        setError(null);
        const payload = {
            tipo: pendingData.tipo,
            monto: Number(pendingData.monto),
            descripcion: pendingData.descripcion,
            categoria: pendingData.categoria,
            cuenta: pendingData.cuenta
        };

        api.put(`/transaccion/modificar/${_id}`, payload).then(response => {
            console.log('Transacción editada', response.data);
            response.data.transaccion.categoria = { nombre: payload.categoria };
            dispatch(actualizarTransaccion(response.data.transaccion));                  
            if (response.data.transaccion.cuentaId === cuentas[0]._id) {
                if (tipo === response.data.transaccion.tipo) {
                    if (tipo === 'ingreso') {
                        dispatch(restarSaldo1(Number(monto)));
                        dispatch(sumarSaldo1(Number(response.data.transaccion.monto)));
                    } else {
                        dispatch(sumarSaldo1(Number(monto)));
                        dispatch(restarSaldo1(Number(response.data.transaccion.monto)));
                    }
                } else {
                    if (response.data.transaccion.tipo === 'ingreso') {
                        dispatch(sumarSaldo1(Number(response.data.transaccion.monto)));
                        dispatch(sumarSaldo1(Number(monto)));
                    } else {
                        dispatch(restarSaldo1(Number(response.data.transaccion.monto)));
                        dispatch(restarSaldo1(Number(monto)));
                    }
                }
            } else if (response.data.transaccion.cuentaId === cuentas[1]._id) {
                if (tipo === response.data.transaccion.tipo) {
                    if (tipo === 'ingreso') {
                        dispatch(restarSaldo2(Number(monto)));
                        dispatch(sumarSaldo2(Number(response.data.transaccion.monto)));
                    } else {
                        dispatch(sumarSaldo2(Number(monto)));
                        dispatch(restarSaldo2(Number(response.data.transaccion.monto)));
                    }
                } else {
                    if (response.data.transaccion.tipo === 'ingreso') {
                        dispatch(sumarSaldo2(Number(response.data.transaccion.monto)));
                        dispatch(sumarSaldo2(Number(monto)));
                    } else {
                        dispatch(restarSaldo2(Number(response.data.transaccion.monto)));
                        dispatch(restarSaldo2(Number(monto)));
                    }
                }
            }
            toast.success(t('toasts.editSuccess'));
            handleEdit(null);
        }).catch(error => {
            console.error('Error al editar transacción', error);
            toast.error(t('toasts.editError'));
            setError(t('errors.editTransaction'));
        }).finally(() => setLoading(false));
    }

    const handleCancelConfirm = () => {
        setShowConfirm(false);
        setPendingData(null);
    }

    return (
        <div className="modal-overlay" role="presentation" onMouseDown={handleBackdrop}>
            <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="crear-title">
                <header className="modal-header">
                    <h3 id="crear-title">{t('transactions.createTransaction')}</h3>
                    <div className="modal-actions">
                        <button className="secondary-link" onClick={onClose} type="button">{t('buttons.close')}</button>
                    </div>
                </header>
                <div className="modal-body">
                    {error && <div className="error" role="alert">{error}</div>}
                    <TransaccionEditForm _id={_id} tipo={tipo} monto={monto} categoria={categoria} descripcion={descripcion} handleEdit={handleCreateAttempt} />
                </div>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    title={t('transactions.createTransaction')}
                    message={t('confirmations.createTransaction', { pendingData })}
                    onConfirm={handleConfirm}
                    onCancel={handleCancelConfirm}
                    confirmLabel={loading ? t('buttons.creating') : t('buttons.create')}
                    cancelLabel={t('buttons.cancel')}
                />
            )}
        </div>
    )
}

export default TransaccionEditModal
