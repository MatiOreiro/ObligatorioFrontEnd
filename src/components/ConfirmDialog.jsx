import React from 'react'

const ConfirmDialog = ({ title = 'Confirmar', message, onConfirm, onCancel, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' }) => {
    return (
        <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target.classList.contains('modal-overlay')) onCancel() }}>
            <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
                <header className="modal-header">
                    <h3 id="confirm-title">{title}</h3>
                    <div className="modal-actions">
                        <button className="btn-ghost" onClick={onCancel}>{cancelLabel}</button>
                        <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
                    </div>
                </header>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
