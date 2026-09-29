import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container" id="toast-container">
      <div className="toast glass-panel">
        <CheckCircle2 size={18} color="var(--status-healthy)" />
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{toast.message}</span>
        <button 
          onClick={onClose}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            marginLeft: '8px'
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
