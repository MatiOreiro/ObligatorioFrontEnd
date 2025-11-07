import React, { useEffect, useRef } from 'react'

const TransaccionModal = ({ transaccion, onClose, onEdit = () => {}, onDelete = () => {} }) => {
    const dialogRef = useRef(null)

    useEffect(() => {
        // focus the dialog for accessibility
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const btn = dialogRef.current?.querySelector('button')
        if (btn) btn.focus()

        const handleKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)

        return () => {
            window.removeEventListener('keydown', handleKey)
            document.body.style.overflow = prevOverflow
        }
    }, [onClose])

    if (!transaccion) return null

    const formatDateDMY = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const fecha = transaccion.fecha ? formatDateDMY(transaccion.fecha) : ''
    const categorias = Array.isArray(transaccion.categorias) ? transaccion.categorias.map(c => c?.nombre || c).join(', ') : (transaccion.categoria?.nombre || '-')

    return (
        <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target.classList.contains('modal-overlay')) onClose() }}>
            <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
                <header className="modal-header">
                    <h3 id="modal-title">Detalle de transacción</h3>
                    <div className="modal-actions">
                        <button className="icon-btn btn-primary" onClick={() => onEdit(transaccion)} aria-label="Editar transacción">✎</button>
                        <button className="icon-btn btn-danger" onClick={() => onDelete(transaccion)} aria-label="Eliminar transacción">✕</button>
                        <button className="btn-ghost" onClick={onClose} aria-label="Cerrar modal">Cerrar</button>
                    </div>
                </header>

                <div className="modal-body">
                    <dl className="transaccion-detail-list">
                        <dt>Tipo</dt>
                        <dd>{transaccion.tipo}</dd>

                        <dt>Fecha</dt>
                        <dd>{fecha}</dd>

                        <dt>Monto</dt>
                        <dd>${transaccion.monto}</dd>

                        <dt>Categorías</dt>
                        <dd>{categorias}</dd>

                        <dt>Descripción</dt>
                        <dd>{transaccion.descripcion || '—'}</dd>
                    </dl>
                </div>
            </div>
        </div>
    )
}

export default TransaccionModal
