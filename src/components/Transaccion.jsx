import React from 'react'

const Transaccion = ({ transaccion, onEdit = () => {}, onDelete = () => {}, onDetails = () => {} }) => {
    const formatDateDMY = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const fecha = formatDateDMY(transaccion && transaccion.fecha ? transaccion.fecha : '');
    const tipoRaw = (transaccion && transaccion.tipo) ? String(transaccion.tipo) : '';
    const tipo = tipoRaw.trim();
    const lowerTipo = tipo.toLowerCase();
    const isEgreso = lowerTipo === 'egreso';
    const isIngreso = lowerTipo === 'ingreso';
    const formatTipo = t => t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : '';
    const tipoLabel = formatTipo(tipo);

    // Manejo de categorías: puede venir como `categoria` (objeto) o `categorias` (array)
    let categorias = '-';
    if (transaccion) {
        if (Array.isArray(transaccion.categorias) && transaccion.categorias.length > 0) {
            categorias = transaccion.categorias.map(c => (c && c.nombre) ? c.nombre : String(c)).join(', ');
        } else if (transaccion.categoria) {
            categorias = transaccion.categoria.nombre || String(transaccion.categoria);
        }
    }

    return (
        <article className="transaccion-card" aria-label={`Transacción ${tipoLabel} ${transaccion?.monto}`}>
            <div className="transaccion-body">
                <header className="transaccion-header">
                    <div>
                        <div className="transaccion-top">
                            <span className={`transaccion-type ${isEgreso ? 'expense' : isIngreso ? 'income' : ''}`}>
                                {isEgreso || isIngreso ? tipoLabel : tipo}
                            </span>
                            <strong className="transaccion-amount">${transaccion?.monto ?? '0.00'}</strong>
                        </div>
                        <div className="transaccion-meta">{fecha} • {categorias}</div>
                    </div>

                    <div className="transaccion-buttons">
                        <button className="icon-btn btn-ghost" onClick={() => onDetails(transaccion)} aria-label="Ver detalles">
                            {/* document icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <button className="icon-btn btn-primary" onClick={() => onEdit(transaccion)} aria-label="Editar transacción">
                            {/* pencil icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M3 21v-3.75L14.06 6.19a2.5 2.5 0 0 1 3.54 0l0 0a2.5 2.5 0 0 1 0 3.54L6.5 21H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <button className="icon-btn btn-danger" onClick={() => onDelete(transaccion)} aria-label="Eliminar transacción">
                            {/* X icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </header>
                {/* descripción removida por petición del usuario */}
            </div>
        </article>
    )
}

export default Transaccion