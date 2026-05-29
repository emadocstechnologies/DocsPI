import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, Wifi } from 'lucide-react';
import { formatUptimeShort, computeQualityScore, getQualityLabel } from '../utils';

export default function TrafficCounter({ isConnected, dnsLatencies, ispName }) {
  const [uptime, setUptime] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (isConnected) {
      if (!startRef.current) {
        startRef.current = Date.now();
      }
      const interval = setInterval(() => {
        if (startRef.current) {
          setUptime(Math.floor((Date.now() - startRef.current) / 1000));
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      startRef.current = null;
      setUptime(0);
    }
  }, [isConnected]);

  const qualityScore = computeQualityScore(dnsLatencies);
  const quality = getQualityLabel(qualityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '12px 16px',
        width: '100%',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
      }}>
        {/* Uptime */}
        <div style={{
          padding: '8px 10px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: '0.6rem', fontWeight: 600, color: '#64748b',
            textTransform: 'uppercase', marginBottom: '4px',
          }}>
            <Clock size={10} /> Oturum
          </div>
          <div style={{
            fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {isConnected ? formatUptimeShort(uptime) : '---'}
          </div>
        </div>

        {/* Tahmini Veri */}
        <div style={{
          padding: '8px 10px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: '0.6rem', fontWeight: 600, color: '#64748b',
            textTransform: 'uppercase', marginBottom: '4px',
          }}>
            <Wifi size={10} /> Tahmini Veri
          </div>
          <div style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa',
          }}>
            {isConnected ? estimateDataUsage(uptime, qualityScore || 50) : '---'}
          </div>
        </div>

        {/* Baglanti Kalitesi */}
        <div style={{
          padding: '8px 10px',
          background: qualityScore !== null ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)',
          borderRadius: '10px',
          border: qualityScore !== null
            ? `1px solid ${quality.color}22`
            : '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: '0.6rem', fontWeight: 600, color: '#64748b',
            textTransform: 'uppercase', marginBottom: '4px',
          }}>
            <Activity size={10} /> Kalite
          </div>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: qualityScore !== null ? quality.color : '#52525b',
          }}>
            {qualityScore !== null ? (
              <>
                <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{qualityScore} </span>
                {quality.text}
              </>
            ) : '---'}
          </div>
        </div>
      </div>

      {/* Kalite skor bar */}
      {qualityScore !== null && (
        <div style={{ marginTop: '8px' }}>
          <div style={{
            height: '3px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${qualityScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: quality.color,
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}



