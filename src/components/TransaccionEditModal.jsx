import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import api from '../data/api';
import { guardarTransacciones } from '../features/transacciones.slice';
import ConfirmDialog from './ConfirmDialog';
import EditTransaccionForm from './EditTransaccionForm';
import { useTranslation } from 'react-i18next';

const TransaccionEditModal = ({ transaccion, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pendingData, setPendingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dialogRef = useRef(null);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const btn = dialogRef.current?.querySelector('button');
        if (btn) btn.focus();
        const onKey = (e) => { if (e.key === 'Escape') onClose(); }
        window.addEventListener('keydown', onKey);
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; }
    }, [onClose]);

    // handler called by the inner EditTransaccionForm when the form is submitted
    const handleEditAttempt = (data) => {
        setPendingData(data);
        setConfirming(true);
    }

    return (
        <>
        <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target.classList.contains('modal-overlay')) onClose() }}>
            <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-title" ref={dialogRef}>
                <header className="modal-header">
                    <h3 id="edit-title">{t('transactions.title')}</h3>
                    <div className="modal-actions">
                        <button type="button" className="btn-ghost" onClick={onClose}>{t('buttons.close')}</button>
                    </div>
                </header>

                <div className="modal-body">
                    {errorMessage && <div className="error" role="alert">{errorMessage}</div>}
                    <EditTransaccionForm initialValues={transaccion} onEdit={handleEditAttempt} />
                </div>
            </div>
        </div>

        {confirming && (
            <ConfirmDialog
                title={t('transactions.editTransaction')}
                message={t('confirmations.editTransaction', { monto: pendingData?.monto })}
                confirmLabel={t('buttons.save')}
                cancelLabel={t('buttons.cancel')}
                onConfirm={async () => {
                    setConfirming(false);
                    setLoading(true);
                    // perform the same submit flow as before: compute fecha and send payload
                    const token = localStorage.getItem('token');
                    // recompute fechaToSend synchronizing with server as before
                    let fechaToSend;
                    try {
                        const serverTime = await getServerTime(token);
                        if (serverTime && !Number.isNaN(serverTime.getTime())) {
                            // Use a very small safety margin (2 seconds) when we have authoritative server time
                            const candidate = new Date(serverTime.getTime() - 2 * 1000);
                            fechaToSend = candidate.toISOString();
                            console.debug('[TransaccionEditModal] serverTime:', serverTime.toISOString(), 'fechaToSend:', fechaToSend);
                        } else {
                            // fallback: client time minus 1 hour (use larger conservative margin when server time is unavailable)
                            fechaToSend = new Date(Date.now() - 3600 * 1000).toISOString();
                            console.debug('[TransaccionEditModal] no serverTime, fallback (client-1h) fechaToSend:', fechaToSend);
                        }
                    } catch (err) {
                        fechaToSend = new Date(Date.now() - 3600 * 1000).toISOString();
                        console.debug('[TransaccionEditModal] getServerTime error, fallback (client-1h) fechaToSend:', fechaToSend, err);
                    }

                    const { tipo: pTipo, monto: pMonto, categoria: pCategoria, descripcion: pDescripcion } = pendingData || {};
                    const categoriasArr = (pCategoria || '').split(',').map(s => s.trim()).filter(Boolean);
                    const payload = { tipo: String(pTipo).toLowerCase(), monto: Number(pMonto), descripcion: pDescripcion, fecha: fechaToSend };
                    if (categoriasArr.length > 0) payload.categoria = categoriasArr[0];

                    try {
                        await api.put(`/transaccion/modificar/${transaccion._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                        const response = await api.get('/transaccion/filtrar', { headers: { Authorization: `Bearer ${token}` } });
                        dispatch(guardarTransacciones(response.data.transacciones));
                        onClose();
                    } catch (err) {
                        console.error('Error al editar transacción (confirm flow)', err);
                        // intentar detectar si el backend devolvió la fecha límite en el mensaje y reintentar inmediatamente
                        const respData = err?.response?.data;
                        const text = typeof respData === 'string' ? respData : JSON.stringify(respData || {});
                        const isoMatch = text.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
                        // No automatic retry: show server message so the user can re-attempt or adjust.
                        const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
                        setErrorMessage(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
                    } finally {
                        setLoading(false);
                    }
                }}
                onCancel={() => setConfirming(false)}
            />
        )}
        </>
    )
}

export default TransaccionEditModal
