import { Gamepad2, Zap, Activity, Shield, Headphones } from 'lucide-react';

const MODE_CONFIG = {
  smooth: {
    label: 'Smooth',
    desc: 'Stable web browsing',
    icon: Zap,
    color: '#facc15',
    bg: 'rgba(250,204,21,0.08)',
    border: 'rgba(250,204,21,0.2)',
  },
  game: {
    label: 'Game',
    desc: 'UDP games, Discord, low latency',
    icon: Gamepad2,
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
  },
  super: {
    label: 'Super',
    desc: 'Divert engine + full bypass',
    icon: Shield,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
  },
};

export default function GameModePanel({ config, updateConfig, isConnected }) {
  const currentMode = config.networkMode || 'smooth';
  const m = MODE_CONFIG[currentMode] || MODE_CONFIG.smooth;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '12px 14px',
      width: '100%',
    }}>
      <div style={{
        fontSize: '0.68rem', fontWeight: '600', color: '#71717a',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px',
      }}>
        Network Mode
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        {Object.entries(MODE_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = currentMode === key;
          return (
            <button
              key={key}
              onClick={() => updateConfig('networkMode', key)}
              disabled={isConnected}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 6px',
                borderRadius: '10px',
                border: isActive ? `1px solid ${cfg.border}` : '1px solid rgba(255,255,255,0.06)',
                background: isActive ? cfg.bg : 'rgba(255,255,255,0.02)',
                color: isActive ? cfg.color : '#71717a',
                cursor: isConnected ? 'not-allowed' : 'pointer',
                opacity: isConnected ? 0.4 : 1,
                transition: 'all 0.2s',
                fontSize: '0.6rem',
                fontWeight: '600',
                outline: 'none',
              }}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{cfg.label}</span>
              {isActive && <div style={{
                width: '14px', height: '2px', borderRadius: '1px',
                background: cfg.color, marginTop: '1px',
              }} />}
            </button>
          );
        })}
      </div>

      {/* Settings for game mode */}
      {currentMode === 'game' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px 10px',
          background: 'rgba(74,222,128,0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(74,222,128,0.08)',
        }}>
          {/* Discord optimization info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
          }}>
            <Headphones size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
            <span style={{ flex: 1, color: '#a1a1aa' }}>
              Discord optimization active
            </span>
            <span style={{
              fontSize: '0.6rem', fontWeight: '700', color: '#4ade80',
              background: 'rgba(74,222,128,0.1)', padding: '2px 6px',
              borderRadius: '4px',
            }}>
              ACTIVE
            </span>
          </div>

          {/* UDP status info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
          }}>
            <Activity size={14} style={{ color: '#a78bfa', flexShrink: 0 }} />
            <span style={{ flex: 1, color: '#a1a1aa' }}>
              UDP bypass via WinDivert
            </span>
            <span style={{
              fontSize: '0.6rem', fontWeight: '700', color: '#a78bfa',
              background: 'rgba(124, 58, 237,0.1)', padding: '2px 6px',
              borderRadius: '4px',
            }}>
              READY
            </span>
          </div>
        </div>
      )}

      {/* Super mode info */}
      {currentMode === 'super' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          background: 'rgba(167,139,250,0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(167,139,250,0.1)',
          fontSize: '0.72rem',
          color: '#a1a1aa',
        }}>
          <Shield size={14} style={{ color: '#a78bfa', flexShrink: 0 }} />
          <span>Divert engine + DNS redirect + full UDP bypass active</span>
        </div>
      )}
    </div>
  );
}

// Commit: feat: implement GameModePanel component [132225]
