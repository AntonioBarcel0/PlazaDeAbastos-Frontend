import { useEffect } from 'react';
import './LogoutModal.css';

function LogoutModal({ onConfirm, onCancel }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="logout-modal-backdrop" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2 className="logout-modal-title">Cerrar sesion</h2>
        <p className="logout-modal-text">¿Seguro que quieres cerrar sesion?</p>
        <div className="logout-modal-actions">
          <button className="logout-modal-btn logout-modal-btn--cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="logout-modal-btn logout-modal-btn--confirm" onClick={onConfirm}>
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
