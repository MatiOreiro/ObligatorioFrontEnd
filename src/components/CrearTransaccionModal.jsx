import React, { useEffect, useState } from 'react'
import CrearTransaccionForm from './CrearTransaccionForm'
import ConfirmDialog from './ConfirmDialog'
import api from '../data/api'
import { useDispatch } from 'react-redux'
import { agregarTransaccion } from '../features/transacciones.slice'
import { useTranslation } from 'react-i18next'

const CrearTransaccionModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pendingData, setPendingData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

        api.post('/transaccion/crear', payload).then(response => {
            // create a local representation (server may return different shape)
            const transaccion = { tipo: payload.tipo, monto: payload.monto, descripcion: payload.descripcion, categoria: { nombre: payload.categoria }, cuenta: payload.cuenta, fecha: new Date().toISOString() };
            dispatch(agregarTransaccion(transaccion));
            onClose();
        }).catch(err => {
            console.error('Error creando transacción', err);
            setError('No se pudo crear la transacción.');
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
                    <CrearTransaccionForm onCreate={handleCreateAttempt} />
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

export default CrearTransaccionModal
