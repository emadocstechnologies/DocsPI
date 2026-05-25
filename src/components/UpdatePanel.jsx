import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Download, Check, AlertTriangle, Clock, RotateCw, Shield, Activity, ChevronRight } from 'lucide-react';
import { useUpdate } from '../context/UpdateContext';
import { parseChangelog, getUpdateHistory, getAppName } from '../lib/update';

// Faz 5: Update Panel UI
// Faz 8: Indirme ilerlemesi
// Faz 9: Kanal secici
// Faz 10: Otomatik indirme
// Faz 15: Gecmis logu
// Faz 19: Rozet
// Faz 20: Teshis
export default function UpdatePanel({ style }) {
  const {
    status,
    currentVersion,
    latestVersion,
    changelog,
    changelogSections,
    downloadProgress,
    error,
    channel,
    autoDownload,
    history,
    diagnostic,
    checkUpdate,
    downloadRelease,
    applyUpdate,
    setChannel,
    setAutoDownloadEnabled,
    refreshHistory,
    skipVersion,
    runDiagnostic,
  } = useUpdate();

  const [showHistory, setShowHistory] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [expandedChangelog, setExpandedChangelog] = useState(false);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const statusColors = {
    idle: '#64748b',
    checking: '#facc15',
    available: '#a78bfa',
    downloading: '#a78bfa',
    downloaded: '#4ade80',
    installing: '#a855f7',
    error: '#f87171',
  };

  const statusLabels = {
    idle: 'Guncel',
    checking: 'Kontrol ediliyor...',
    available: 'Guncelleme var',
    downloading: 'Indiriliyor...',
    downloaded: 'Indirildi',
    installing: 'Kuruluyor...',
    error: 'Hata',
  };

  const sections = changelogSections?.length > 0
    ? changelogSections
    : parseChangelog(changelog || '');

  const handleCheck = async () => {
    await checkUpdate({ silent: false });
  };

  const handleDownload = async () => {
    const state = { latestVersion, downloadUrl: null, downloadName: 'DocsPI-Setup.exe' };
    await downloadRelease(state.downloadUrl, state.downloadName, latestVersion);
  };

  const fullHistory = getUpdateHistory();

  return (
    <div style={style || {}}>
      {/* Baslik / Surum bilgisi */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px', borderRadius: '12px',
        background: status === 'available' ? 'rgba(96,165,250,0.06)' : 'rgba(255,255,255,0.02)',
        border: status === 'available' ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: status === 'available' ? 'rgba(96,165,250,0.15)' : status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
        }}>
          {status === 'checking' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 16, height: 16,
                border: '2px solid rgba(255,255,255,0.15)',
                borderTopColor: '#facc15', borderRadius: '50%',
              }}
            />
          ) : status === 'downloading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 16, height: 16,
                border: '2px solid rgba(255,255,255,0.15)',
                borderTopColor: '#a78bfa', borderRadius: '50%',
              }}
            />
          ) : status === 'downloaded' || status === 'installing' ? (
            <Check size={20} color="#4ade80" />
          ) : status === 'error' ? (
            <AlertTriangle size={20} color="#f87171" />
          ) : (
            <Shield size={20} color={status === 'available' ? '#a78bfa' : '#64748b'} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {getAppName()} v{currentVersion}
            {status === 'available' && (
              <span style={{
                padding: '1px 6px', borderRadius: '4px',
                background: 'rgba(96,165,250,0.15)', color: '#a78bfa',
                fontSize: '0.6rem', fontWeight: 600,
              }}>
                {latestVersion}
              </span>
            )}
          </div>
          <div style={{
            fontSize: '0.68rem', color: statusColors[status] || '#64748b', marginTop: '2px',
          }}>
            {status === 'available'
              ? 'Yeni surum kullanima hazir'
              : status === 'downloaded'
                ? 'Guncelleme indirildi, kuruluma hazir'
                : status === 'error'
                  ? error || 'Bilinmeyen hata'
                  : statusLabels[status]}
          </div>
        </div>

        {/* Action butonlari */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {(status === 'available') && (
            <button
              onClick={handleDownload}
              style={{
                padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
                color: '#a78bfa', fontWeight: 600, fontSize: '0.68rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Download size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Indir
            </button>
          )}
          {status === 'downloaded' && (
            <button
              onClick={applyUpdate}
              style={{
                padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
                color: '#4ade80', fontWeight: 600, fontSize: '0.68rem',
                whiteSpace: 'nowrap',
              }}
            >
              <RefreshCw size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Kur
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={status === 'checking'}
            style={{
              padding: '6px 10px', borderRadius: '8px', cursor: status === 'checking' ? 'not-allowed' : 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: status === 'checking' ? '#52525b' : '#a1a1aa', fontWeight: 500, fontSize: '0.68rem',
            }}
          >
            <RotateCw size={14} style={{ verticalAlign: 'middle' }} className={status === 'checking' ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Indirme ilerlemesi */}
      {status === 'downloading' && downloadProgress && (
        <div style={{ marginTop: '10px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.6rem', color: '#64748b', marginBottom: '4px',
          }}>
            <span>Indiriliyor...</span>
            <span>%{downloadProgress.percent}</span>
          </div>
          <div style={{
            height: '4px', background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px', overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${downloadProgress.percent}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%', background: '#a78bfa', borderRadius: '2px' }}
            />
          </div>
          <div style={{ fontSize: '0.6rem', color: '#52525b', marginTop: '4px', textAlign: 'right' }}>
            {(downloadProgress.received / 1024 / 1024).toFixed(1)} MB / {(downloadProgress.total / 1024 / 1024).toFixed(1)} MB
          </div>
        </div>
      )}

      {/* Changelog */}
      {status === 'available' && sections.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={() => setExpandedChangelog(!expandedChangelog)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.65rem', color: '#64748b',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            {expandedChangelog ? <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} /> : <ChevronRight size={12} />}
            Neler yeni? ({sections.length > 0 ? sections[0].title : ''})
          </button>
          {expandedChangelog && (
            <div style={{
              marginTop: '6px', maxHeight: '200px', overflowY: 'auto',
              fontSize: '0.62rem', color: '#94a3b8', lineHeight: '1.6',
              background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px',
            }}>
              {sections.map((section, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '3px' }}>{section.title}</div>
                  {section.items.map((item, j) => (
                    <div key={j} style={{ paddingLeft: '6px' }}>&bull; {item}</div>
                  ))}
                </div>
              ))}
              {sections.length === 0 && changelog && (
                <div style={{ whiteSpace: 'pre-wrap' }}>{changelog}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ayarlar */}
      <div style={{
        marginTop: '16px', padding: '14px', borderRadius: '10px',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '10px' }}>
          GUNCELLEME AYARLARI
        </div>

        {/* Faz 9: Kanal secici */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>Guncelleme Kanali</div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px' }}>Beta surumleri gormek icin beta kanalini secin</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setChannel('stable')}
              style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600,
                cursor: 'pointer',
                background: channel === 'stable' ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
                border: channel === 'stable' ? '1px solid rgba(96,165,250,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: channel === 'stable' ? '#a78bfa' : '#64748b',
              }}
            >
              Stable
            </button>
            <button
              onClick={() => setChannel('beta')}
              style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600,
                cursor: 'pointer',
                background: channel === 'beta' ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)',
                border: channel === 'beta' ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: channel === 'beta' ? '#a855f7' : '#64748b',
              }}
            >
              Beta
            </button>
          </div>
        </div>

        {/* Faz 10: Otomatik indirme */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>Otomatik Indir</div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px' }}>Guncellemeleri arka planda otomatik indir</div>
          </div>
          <div
            onClick={() => setAutoDownloadEnabled(!autoDownload)}
            style={{
              width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer',
              background: autoDownload ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.1)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: autoDownload ? '#4ade80' : '#64748b',
              position: 'absolute', top: '2px',
              left: autoDownload ? '18px' : '2px',
              transition: 'all 0.2s',
            }} />
          </div>
        </div>
      </div>

      {/* Gecmis logu */}
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.65rem', color: '#64748b',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
          }}
        >
          <Clock size={12} />
          {showHistory ? 'Gizle' : `Guncelleme Gecmisi (${fullHistory.length})`}
        </button>
        {showHistory && (
          <div style={{ marginTop: '6px', maxHeight: '150px', overflowY: 'auto' }}>
            {fullHistory.length === 0 ? (
              <div style={{ fontSize: '0.62rem', color: '#52525b', textAlign: 'center', padding: '8px' }}>
                Henuz guncelleme kaydi yok
              </div>
            ) : (
              fullHistory.map((entry, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 8px', borderRadius: '6px', marginBottom: '2px',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#cbd5e1' }}>
                      v{entry.version}
                    </span>
                    <span style={{
                      fontSize: '0.55rem', color: '#52525b', marginLeft: '6px',
                    }}>
                      {new Date(entry.timestamp).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.55rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                    background: entry.status === 'installed'
                      ? 'rgba(74,222,128,0.12)' : entry.status === 'downloaded'
                        ? 'rgba(96,165,250,0.12)' : entry.status === 'found'
                          ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.05)',
                    color: entry.status === 'installed'
                      ? '#4ade80' : entry.status === 'downloaded'
                        ? '#a78bfa' : entry.status === 'found'
                          ? '#facc15' : '#64748b',
                  }}>
                    {entry.status === 'installed' ? 'Kuruldu' : entry.status === 'downloaded' ? 'Indi' : entry.status === 'found' ? 'Bulundu' : entry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Teshis */}
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={() => {
            runDiagnostic();
            setShowDiagnostic(!showDiagnostic);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.65rem', color: '#64748b',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
          }}
        >
          <Activity size={12} />
          {showDiagnostic ? 'Gizle' : 'Sistem Teshisi'}
        </button>
        {showDiagnostic && diagnostic && (
          <div style={{
            marginTop: '6px', padding: '10px', borderRadius: '8px',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <InfoRow label="Surum" value={`v${diagnostic.version}`} />
              <InfoRow label="Platform" value={diagnostic.platform?.os || '-'} />
              <InfoRow label="Son Kontrol" value={diagnostic.lastUpdateCheck} />
              <InfoRow label="Guncelleme Sayisi" value={String(diagnostic.updateCount)} />
              <InfoRow label="Config" value={diagnostic.configExists ? 'Var' : 'Yok'} />
              <InfoRow label="Profil Sayisi" value={String(diagnostic.profilesCount)} />
            </div>
            {diagnostic.issues?.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#f87171', marginBottom: '4px' }}>
                  Tespit Edilen Sorunlar:
                </div>
                {diagnostic.issues.map((issue, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.6rem', color: issue.severity === 'critical' ? '#f87171' : '#facc15',
                    padding: '2px 0',
                  }}>
                    <AlertTriangle size={10} />
                    {issue.message}
                  </div>
                ))}
              </div>
            )}
            {diagnostic.healthy && (
              <div style={{
                marginTop: '8px', fontSize: '0.6rem', color: '#4ade80', fontWeight: 600,
                textAlign: 'center',
              }}>
                <Check size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Sistem saglikli gorunuyor
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ padding: '3px 0' }}>
      <span style={{ fontSize: '0.55rem', color: '#64748b', display: 'block' }}>{label}</span>
      <span style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
