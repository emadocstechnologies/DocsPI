import { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

const MAX_SAMPLES = 30;

export default function LatencyGraph({ pingMs, isConnected }) {
  const [samples, setSamples] = useState([]);
  const [graphSummary, setGraphSummary] = useState({ min: 0, max: 0, avg: 0 });
  const tickRef = useRef(null);

  useEffect(() => {
    if (isConnected && pingMs !== null) {
      setSamples(prev => {
        const next = [...prev, pingMs];
        if (next.length > MAX_SAMPLES) next.shift();
        return next;
      });
    } else if (!isConnected) {
      setSamples([]);
    }
  }, [pingMs, isConnected]);

  useEffect(() => {
    if (samples.length > 0) {
      setGraphSummary({
        min: Math.min(...samples),
        max: Math.max(...samples),
        avg: Math.round(samples.reduce((a, b) => a + b, 0) / samples.length),
      });
    }
  }, [samples]);

  if (!isConnected || samples.length < 2) return null;

  const maxVal = Math.max(...samples, 1);
  const barHeight = 40;
  const barWidth = Math.max(2, Math.min(4, 480 / samples.length));
  const gap = 1;

  const getColor = (val) => {
    if (val < 50) return '#4ade80';
    if (val < 100) return '#facc15';
    if (val < 150) return '#fb923c';
    return '#f87171';
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '10px 14px',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.68rem',
          fontWeight: '600',
          color: '#71717a',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <Activity size={12} />
          Latency History
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.62rem', color: '#52525b' }}>
          <span>min: <span style={{ color: '#4ade80', fontWeight: '600' }}>{graphSummary.min}ms</span></span>
          <span>avg: <span style={{ color: '#facc15', fontWeight: '600' }}>{graphSummary.avg}ms</span></span>
          <span>max: <span style={{ color: '#f87171', fontWeight: '600' }}>{graphSummary.max}ms</span></span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: `${gap}px`,
        height: `${barHeight}px`,
      }}>
        {samples.map((val, i) => {
          const pct = val / maxVal;
          const h = Math.max(3, pct * barHeight);
          return (
            <div
              key={i}
              title={`${val}ms`}
              style={{
                width: `${barWidth}px`,
                height: `${h}px`,
                background: getColor(val),
                borderRadius: '2px 2px 0 0',
                opacity: 0.8,
                transition: 'height 0.3s ease, background 0.3s ease',
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}



