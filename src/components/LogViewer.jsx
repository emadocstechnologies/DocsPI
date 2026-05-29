import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertCircle, CheckCircle, XCircle, Trash2, Copy } from 'lucide-react';

const LOG_ICONS = {
  error: XCircle,
  warn: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const LOG_COLORS = {
  error: '#f87171',
  warn: '#facc15',
  success: '#4ade80',
  info: '#a78bfa',
};

export function LogViewer({ logs, onClose, onClear, onCopy, copyStatus, t }) {
  const [filter, setFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return logs;
    return logs.filter(l => l.type === filter);
  }, [logs, filter]);

  const defaultT = {
    logsTitle: 'SİSTEM LOGLARI',
    logsClear: 'TEMİZLE',
    logsCopy: 'KOPYALA',
    logsCopied: 'KOPYALANDI!',
    logsCopyError: 'HATA!',
    logFilterAll: 'Tümü',
    logFilterError: 'Hata',
    logFilterWarn: 'Uyarı',
    logFilterSuccess: 'Başarı',
    logFilterInfo: 'Bilgi',
  };

  const translations = { ...defaultT, ...t };

  const FILTERS = [
    { key: 'all', label: translations.logFilterAll, color: '#a1a1aa', icon: Info },
    { key: 'error', label: translations.logFilterError, color: '#f87171', icon: XCircle },
    { key: 'warn', label: translations.logFilterWarn, color: '#facc15', icon: AlertCircle },
    { key: 'success', label: translations.logFilterSuccess, color: '#4ade80', icon: CheckCircle },
    { key: 'info', label: translations.logFilterInfo, color: '#a78bfa', icon: Info },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="v2-card"
        style={{
          width: '90%',
          maxWidth: '420px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
          }}>
            {translations.logsTitle}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
        }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: `1px solid ${filter === f.key ? f.color : 'var(--border-default)'}`,
                background: filter === f.key ? `${f.color}20` : 'transparent',
                color: filter === f.key ? f.color : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minHeight: '200px',
          maxHeight: '400px',
        }}>
          {filteredLogs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '0.8rem',
              padding: '2rem 0',
            }}>
              Log bulunamadı
            </div>
          ) : (
            filteredLogs.map(log => {
              const Icon = LOG_ICONS[log.type] || Info;
              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '0.75rem',
                    lineHeight: '1.4',
                    color: LOG_COLORS[log.type] || 'var(--text-secondary)',
                    alignItems: 'flex-start',
                    padding: '2px 0',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: '2px' }}>
                    {log.time}
                  </span>
                  <Icon size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ wordBreak: 'break-word' }}>{log.msg}</span>
                </div>
              );
            })
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={onClear}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={16} />
            {translations.logsClear}
          </button>
          <button
            onClick={onCopy}
            disabled={logs.length === 0}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: copyStatus === 'success' ? 'var(--accent-green)' : copyStatus === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity: logs.length === 0 ? 0.5 : 1,
            }}
          >
            <Copy size={16} />
            {copyStatus === 'success' ? translations.logsCopied : copyStatus === 'error' ? translations.logsCopyError : translations.logsCopy}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

