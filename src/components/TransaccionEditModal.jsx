import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import api from '../data/api';
import { guardarTransacciones } from '../features/transacciones.slice';
import ConfirmDialog from './ConfirmDialog';
import { useTranslation } from 'react-i18next';

const TransaccionEditModal = ({ transaccion, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [tipo, setTipo] = useState(transaccion?.tipo || 'ingreso');
    const [monto, setMonto] = useState(transaccion?.monto ?? '');
    const [categorias, setCategorias] = useState(() => {
        if (Array.isArray(transaccion?.categorias)) return transaccion.categorias.map(c => c.nombre || c).join(', ');
        if (transaccion?.categoria) return transaccion.categoria.nombre || String(transaccion.categoria);
        return '';
    });
    const [descripcion, setDescripcion] = useState(transaccion?.descripcion || '');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!transaccion?._id) return;
        // open confirmation dialog before performing the PUT
        setConfirming(true);
        return;
    }

    // Helper: try to get server time from endpoints' Date header. Keep it minimal to avoid noisy 404s.
    const getServerTime = async (token) => {
        // Try HEAD / first (should be lightweight and present)
        try {
            const headResp = await api.head('/', { headers: { Authorization: `Bearer ${token}` } });
            const serverDateHeader = headResp.headers?.date;
            if (serverDateHeader) return new Date(serverDateHeader);
        } catch (_) { /* ignore */ }

        // Try a lightweight GET to a protected endpoint where server likely responds with Date header
        try {
            const getResp = await api.get('/transaccion/filtrar', { headers: { Authorization: `Bearer ${token}` } });
            const serverDateHeader = getResp.headers?.date;
            if (serverDateHeader) return new Date(serverDateHeader);
        } catch (_) { /* ignore */ }

        return null;
    }

    return (
        <>
        <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target.classList.contains('modal-overlay')) onClose() }}>
            <form className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-title" ref={dialogRef} onSubmit={handleSubmit}>
                <header className="modal-header">
                    <h3 id="edit-title">{t('transactions.title')}</h3>
                    <div className="modal-actions">
                        <button type="button" className="btn-ghost" onClick={onClose}>{t('buttons.cancel')}</button>
                        <button type="submit" className="btn-primary" disabled={loading}>{loading ? t('buttons.saving') : t('buttons.save')}</button>
                    </div>
                </header>

                <div className="modal-body">
                    {errorMessage && <div className="error" role="alert">{errorMessage}</div>}
                    <div className="field">
                        <label>{t('transactions.type')}</label>
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="ingreso">{t('income')}</option>
                            <option value="egreso">{t('outcome')}</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>{t('transactions.amount')}</label>
                        <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} required />
                    </div>

                    <div className="field">
                        <label>{t('transactions.category')}</label>
                        <input type="text" value={categorias} onChange={(e) => setCategorias(e.target.value)} placeholder="Alimentos, Hogar" />
                    </div>

                    <div className="field">
                        <label>{t('transactions.description')}</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3}></textarea>
                    </div>
                </div>
            </form>
        </div>

        {confirming && (
            <ConfirmDialog
                title={t('transactions.editTransaction')}
                message={t('confirmations.editTransaction', { monto })}
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

                    const categoriasArr = categorias.split(',').map(s => s.trim()).filter(Boolean);
                    const payload = { tipo: String(tipo).toLowerCase(), monto: Number(monto), descripcion, fecha: fechaToSend };
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
