import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import { Activity, Zap, Globe } from 'lucide-react';

const DNS_LABELS = {
  cloudflare: 'Cloudflare',
  google: 'Google',
  quad9: 'Quad9',
  adguard: 'AdGuard',
  opendns: 'OpenDNS',
};

export default function SpeedTestMeter({ dnsLatencies }) {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const runSpeedTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await invoke('speed_test');
      setTestResult(result);
    } catch (e) {
      setTestResult({ error: String(e) });
    }
    setTesting(false);
  }, []);

  const sortedLatencies = dnsLatencies
    ? Object.entries(dnsLatencies)
        .filter(([_, ms]) => ms && ms < 999)
        .sort(([, a], [, b]) => a - b)
    : [];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '12px 16px',
      width: '100%',
    }}>
      {/* DNS Latency Bar */}
      {sortedLatencies.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: '600',
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px',
          }}>
            DNS Response Times
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sortedLatencies.map(([provider, ms]) => {
              const maxMs = Math.max(...sortedLatencies.map(([, v]) => v), 1);
              const pct = Math.min((ms / maxMs), 1);
              const barColor = ms < 30 ? '#4ade80' : ms < 80 ? '#facc15' : ms < 150 ? '#fb923c' : '#f87171';
              return (
                <div key={provider} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.72rem',
                }}>
                  <span style={{ width: '60px', color: '#a1a1aa', fontWeight: '500', flexShrink: 0 }}>
                    {DNS_LABELS[provider] || provider}
                  </span>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: barColor,
                        borderRadius: '3px',
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <span style={{
                    width: '40px',
                    textAlign: 'right',
                    color: barColor,
                    fontWeight: '600',
                    fontSize: '0.65rem',
                  }}>
                    {ms}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Speed Test Button + Result */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={runSpeedTest}
          disabled={testing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: testing ? 'rgba(255,255,255,0.05)' : 'rgba(124, 58, 237,0.15)',
            border: testing ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(124, 58, 237,0.3)',
            borderRadius: '10px',
            padding: '7px 14px',
            color: testing ? '#71717a' : '#a78bfa',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: testing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          {testing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 14, height: 14,
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#a78bfa',
                borderRadius: '50%',
              }}
            />
          ) : (
            <Zap size={14} />
          )}
          <span>{testing ? 'Testing...' : 'Speed Test'}</span>
        </button>

        <AnimatePresence>
          {testResult && !testResult.error && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                <Activity size={12} style={{ color: '#4ade80' }} />
                <span style={{ color: '#a1a1aa' }}>Latency:</span>
                <span style={{
                  color: testResult.latency_ms < 50 ? '#4ade80' : testResult.latency_ms < 150 ? '#facc15' : '#f87171',
                  fontWeight: '600',
                }}>
                  {testResult.latency_ms}ms
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                <Globe size={12} style={{ color: '#a78bfa' }} />
                <span style={{ color: '#a1a1aa' }}>Speed:</span>
                <span style={{ color: '#a78bfa', fontWeight: '600' }}>
                  {testResult.download_speed_mbps > 0
                    ? `${testResult.download_speed_mbps} Mbps`
                    : 'N/A'}
                </span>
              </div>
            </motion.div>
          )}
          {testResult?.error && (
            <span style={{ color: '#f87171', fontSize: '0.72rem' }}>{testResult.error}</span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Commit: feat: add SpeedTestMeter component [132225]
