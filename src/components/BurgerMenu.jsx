import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const BurgerMenu = ({ open, onClose, children }) => {
  const { t } = useTranslation();

  // lock body scroll when open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; }
  }, [open]);

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onMouseDown={(e) => { if (e.target.classList.contains('sidebar-overlay')) onClose(); }}
        aria-hidden={!open}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`} aria-hidden={!open} role="dialog" aria-label="Menu lateral">
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <h3>Menú</h3>
            <button className="icon-btn btn-ghost" onClick={onClose} aria-label="Cerrar menú">✕</button>
          </div>
          <div className="sidebar-separator" aria-hidden="true" />
          <div className="sidebar-body">
            {/* Render items depending on authentication state */}
            {(() => {
              const navigate = useNavigate();
              const token = localStorage.getItem('token');
              const handleLogout = () => { localStorage.clear(); onClose(); navigate('/'); };

              if (token) {
                return (
                  <nav className="sidebar-nav">
                    <ul>
                      <li><Link to="/dashboard" onClick={onClose}>{t('dashboard')}</Link></li>
                      <li><Link to="/transacciones" onClick={onClose}>{t('transactions.title')}</Link></li>
                      <li><Link to="/actualizar-plan" onClick={onClose}>{t('buttons.planUpdate')}</Link></li>
                      <li><Link to="/sobre-nosotros" onClick={onClose}>{t('aboutUs')}</Link></li>
                      <li><button className="secondary-link" onClick={handleLogout}>{t('logout')}</button></li>
                    </ul>
                  </nav>
                );
              }

              return (
                <nav className="sidebar-nav">
                  <ul>
                    <li><Link to="/" onClick={onClose}>{t('login.title')}</Link></li>
                    <li><Link to="/register" onClick={onClose}>{t('register.title')}</Link></li>
                    <li><Link to="/sobre-nosotros" onClick={onClose}>{t('aboutUs')}</Link></li>
                  </ul>
                </nav>
              );
            })()}
          </div>
        </div>
      </aside>
    </>
  );
}

export default BurgerMenu;
