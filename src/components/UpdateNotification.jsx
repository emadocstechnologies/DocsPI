import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useUpdate } from '../context/UpdateContext';
import { parseChangelog, truncateChangelog } from '../lib/update';

// Faz 16: Akilli bildirim
export default function UpdateNotification({ onOpenSettings }) {
  const {
    status,
    latestVersion,
    changelog,
    downloadProgress,
    checkUpdate,
    downloadRelease,
    applyUpdate,
    skipVersion,
  } = useUpdate();

  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (status === 'available' || status === 'downloaded') {
      setDismissed(false);
    }
  }, [status]);

  if (dismissed) return null;
  if (status !== 'available' && status !== 'downloading' && status !== 'downloaded') return null;

  const showBanner = status === 'available' || status === 'downloading' || status === 'downloaded';
  if (!showBanner) return null;

  const sections = parseChangelog(changelog || '');
  const truncated = truncateChangelog(sections, 3);

  const handleSkip = () => {
    skipVersion(latestVersion);
    setDismissed(true);
  };

  const barColor = status === 'downloading' ? '#a78bfa' : status === 'downloaded' ? '#4ade80' : '#a855f7';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed', bottom: '72px', left: '12px', right: '12px', zIndex: 100,
          background: 'rgba(15,23,42,0.97)',
          border: `1px solid ${barColor}33`,
          borderRadius: '16px',
          padding: '14px 16px',
          backdropFilter: 'blur(16px)',
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${barColor}22`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: status === 'downloaded' ? 'rgba(74,222,128,0.15)' : 'rgba(96,165,250,0.15)',
          }}>
            {status === 'downloading' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderTopColor: '#a78bfa', borderRadius: '50%',
                }}
              />
            ) : (
              <Download size={16} color={status === 'downloaded' ? '#4ade80' : '#a78bfa'} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {status === 'downloading'
                ? 'Indiriliyor...'
                : status === 'downloaded'
                  ? 'Guncelleme Hazir'
                  : `DocsPI ${latestVersion} Hazir`}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
              {status === 'downloading' && downloadProgress
                ? `%${downloadProgress.percent} (${(downloadProgress.received / 1024 / 1024).toFixed(1)} MB)`
                : status === 'downloaded'
                  ? 'Kurulum icin asagidaki butonu kullanin'
                  : 'Yeni surum kullanima hazir'}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            style={{
              background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
              padding: '4px', margin: '-4px', flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Indirme progress bar */}
        {status === 'downloading' && downloadProgress && (
          <div style={{
            marginTop: '10px', height: '4px',
            background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${downloadProgress.percent}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%', background: '#a78bfa', borderRadius: '2px' }}
            />
          </div>
        )}

        {/* Changelog */}
        {status === 'available' && changelog && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                marginTop: '8px', fontSize: '0.65rem', color: '#64748b',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? 'Gizle' : 'Neler yeni?'}
            </button>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                style={{
                  marginTop: '6px', maxHeight: '120px', overflowY: 'auto',
                  fontSize: '0.6rem', color: '#94a3b8', lineHeight: '1.6',
                  background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px',
                }}
              >
                {truncated.map((section, i) => (
                  <div key={i} style={{ marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>{section.title}</div>
                    {section.items.map((item, j) => (
                      <div key={j} style={{ paddingLeft: '8px' }}>&bull; {item}</div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          {status === 'available' && (
            <>
              <button
                onClick={async () => {
                  await downloadRelease(null, null, latestVersion);
                }}
                style={{
                  flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer',
                  background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
                  color: '#a78bfa', fontWeight: 600, fontSize: '0.72rem',
                }}
              >
                <Download size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Indir
              </button>
              <button
                onClick={handleSkip}
                style={{
                  padding: '8px 12px', borderRadius: '10px', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#64748b', fontWeight: 500, fontSize: '0.68rem',
                }}
              >
                Atla
              </button>
            </>
          )}
          {status === 'downloaded' && (
            <>
              <button
                onClick={async () => {
                  await applyUpdate();
                }}
                style={{
                  flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer',
                  background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80', fontWeight: 600, fontSize: '0.72rem',
                }}
              >
                <RefreshCw size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Kur ve Yeniden Baslat
              </button>
            </>
          )}
          {status === 'downloading' && (
            <div style={{ fontSize: '0.65rem', color: '#64748b', textAlign: 'center', width: '100%' }}>
              Indirme devam ediyor, lutfen bekleyin...
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Commit: feat: add UpdateNotification component [132226]
