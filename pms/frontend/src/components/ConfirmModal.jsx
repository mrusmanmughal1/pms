import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center', margin: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
          <AlertTriangle size={48} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>
          {title}
        </h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            style={{ 
              padding: '0.6rem 1.2rem', 
              borderRadius: '0.4rem', 
              border: '1px solid #e2e8f0', 
              background: '#f8fafc', 
              color: '#334155', 
              cursor: 'pointer', 
              fontWeight: '600',
              flex: 1
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            style={{ 
              padding: '0.6rem 1.2rem', 
              borderRadius: '0.4rem', 
              border: 'none', 
              background: '#ef4444', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: '600',
              flex: 1
            }}
          >
            {isLoading ? 'Processing...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
