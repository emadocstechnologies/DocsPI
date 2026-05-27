import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronDown, Globe, Power, Zap, RotateCw, Activity, Pin,
  Coffee, AlertTriangle, Check, Wrench, Languages, Bell, Shield, Settings as SettingsIcon, Github, MessageCircle, Sun, Moon, Lock, ShieldAlert, Sparkles, Gamepad2
} from 'lucide-react';
import { enable, disable } from '@tauri-apps/plugin-autostart';
import { Command } from '@tauri-apps/plugin-shell';
import { openUrl } from '@tauri-apps/plugin-opener';
import { invoke } from '@tauri-apps/api/core';
import { getTranslations, SUPPORTED_LANGUAGES } from './i18n';
import { URLS } from './constants';
import { ISP_PROFILES, CHUNK_SIZES, DEFAULT_CHUNKS } from './profiles';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { settingsStyles as s } from './styles/settings';
import BypassTest from './components/BypassTest';
import UpdatePanel from './components/UpdatePanel';
import './App.css';

const Toggle = ({ checked, onChange, disabled }) => (
  <div
    className={`v2-toggle ${checked ? 'active' : ''}`}
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onChange(!checked);
    }}
    style={disabled ? { opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'auto' } : {}}
  >
    <div className="v2-toggle-thumb" />
  </div>
);

const Settings = ({ onBack, config, updateConfig, dnsLatencies, setDnsLatencies, savedProfiles = [], saveProfile, loadProfile, deleteProfile, history, resetHistory, formatUptime, proxyPort, isAdmin, autoDetectResult, dpiSeverity, detectedIsp }) => {
  const { theme: themeName, setTheme, toggleTheme } = useTheme();
  const { deviceId, isActivated, activate, deactivate, isPremium } = useAuth();
  const t = useMemo(() => getTranslations(config.language || "tr"), [config.language]);
  const [activeTab, setActiveTab] = useState('general');
  const scrollRef = useRef(null);

  const[expandedISP, setExpandedISP] = useState(null);
  const [driverInstalled, setDriverInstalled] = useState(false);
  const [driverInfo, setDriverInfo] = useState({ installed: false, version: 'N/A', minimum_required: '2.2.0', type: 'WinDivert' });
  const [needsRestart, setNeedsRestart] = useState(false);
  const [showNpcapDetails, setShowNpcapDetails] = useState(false);

  useEffect(() => {
    invoke('get_driver_info').then(info => {
      setDriverInfo(info);
      setDriverInstalled(info.installed);
    });
}, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);
  // DNS latencies App.jsx'ten prop olarak geliyor — ayarlardan çıkınca kaybolmaz
  const latencies = dnsLatencies || {};
  const setLatencies = setDnsLatencies || (() => {});
  const [isChecking, setIsChecking] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  const [sortedProviders, setSortedProviders] = useState([]);
  const [fixStatus, setFixStatus] = useState('idle');
  const [dnsTestResult, setDnsTestResult] = useState(null);

  // Profil kaydetme
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileFeedback, setProfileFeedback] = useState(null);
  const handleSaveProfile = () => {
    if (!profileNameInput.trim()) return;
    saveProfile?.(profileNameInput.trim());
    setProfileNameInput('');
    setProfileFeedback('saved');
    setTimeout(() => setProfileFeedback(null), 2000);
  };
  const handleLoadProfile = (profile) => {
    loadProfile?.(profile);
    setProfileFeedback('loaded');
    setTimeout(() => setProfileFeedback(null), 2000);
  };

  // Özel domain listesi
  const [domainInput, setDomainInput] = useState('');
  const handleAddDomain = () => {
    const val = domainInput.trim().toLowerCase();
    if (!val) return;
    const current = config.customDomains || [];
    if (!current.includes(val)) {
      updateConfig('customDomains', [...current, val]);
    }
    setDomainInput('');
  };
  const handleRemoveDomain = (domain) => {
    const current = config.customDomains || [];
    updateConfig('customDomains', current.filter(d => d !== domain));
  };

  const lang = config.language || 'tr';
  // t is already defined via useMemo above — using that instance for consistency

  // DNS Providers with translations
  // P2-FIX: Bellek sızıntısı önlendi - Her renderda tekrardan oluşmasını engelledik
  const DNS_PROVIDERS = useMemo(() => {
    const base = [
      { id: 'system', name: t.dnsSystemDefault, desc: t.dnsSystemDefaultDesc, ip: null },
      { id: 'cloudflare', name: 'Cloudflare', desc: t.dnsCfDesc, ip: '1.1.1.1' },
      { id: 'google', name: 'Google', desc: t.dnsGoogleDesc, ip: '8.8.8.8' },
      { id: 'global', name: 'Global DNS', desc: 'Google/Cloudflare Fallback', ip: '8.8.4.4' },
      { id: 'adguard', name: 'AdGuard', desc: t.dnsAdguardDesc, ip: '94.140.14.14' },
      { id: 'quad9', name: 'Quad9', desc: t.dnsQuad9Desc, ip: '9.9.9.9' },
      { id: 'opendns', name: 'OpenDNS', desc: t.dnsOpenDnsDesc, ip: '208.67.222.222' },
      { id: 'alibaba', name: 'Alibaba', desc: 'Asian Fast DNS', ip: '223.5.5.5' },
      { id: 'yandex', name: 'Yandex', desc: 'Russian DNS', ip: '77.88.8.8' }
    ];

    if (isPremium) {
      base.push({ id: 'premium_ultra', name: 'PREMIUM ULTRA', desc: 'Ultra Fast Private DNS', ip: '1.1.1.1', premium: true });
    }
    return base;
  }, [t, isPremium]);

  // P2-FIX: Dil değiştirildiğinde mevcut internet gecikmesi (Ping) sırasının kalıcı olması sağlandı
  useEffect(() => {
    if (Object.keys(latencies).length > 0) {
      const systemDns = DNS_PROVIDERS.find(p => p.id === 'system');
      const otherDns = DNS_PROVIDERS.filter(p => p.id !== 'system')
        .sort((a, b) => (latencies[a.id] || 999) - (latencies[b.id] || 999));
      setSortedProviders(systemDns ? [systemDns, ...otherDns] : otherDns);
    } else {
      setSortedProviders(DNS_PROVIDERS);
    }
  }, [lang, latencies, DNS_PROVIDERS]);

  useEffect(() => {
    checkAutostart();
  }, []);


  const checkAutostart = async () => {
    try {
      const active = await invoke('check_autostart_admin');
      setAutostartEnabled(active);
    } catch (e) {
      setAutostartEnabled(config.autoStart === true);
    }
  };

  const toggleAutostart = async (val) => {
    try {
      await invoke('set_autostart_admin', { enable: val });
      setAutostartEnabled(val);
      updateConfig('autoStart', val);
    } catch (e) {
      // Task Scheduler başarısız olursa plugin fallback
      try {
        if (val) { await enable(); } else { await disable(); }
        setAutostartEnabled(val);
        updateConfig('autoStart', val);
      } catch (e2) {
        console.error('Autostart toggle failed:', e2);
      }
    }
  };

  const checkAllLatencies = async (forceSelectBest = false) => {
    setIsChecking(true);
    const newLatencies = {};
    
    const pingableProviders = DNS_PROVIDERS.filter(p => p.ip !== null);
    
    const isSlowConnection = navigator.connection?.effectiveType === '3g' || navigator.connection?.effectiveType === '2g';
    const TIMEOUT_MS = isSlowConnection ? 3000 : 1500;

    const results = await Promise.allSettled(
      pingableProviders.map(async (provider) => {
        try {
          // P0-FIX: Frontend shell bypass edildi, güvenli arka uç kullanılıyor.
          const latency = await invoke('check_dns_latency', { dnsIp: provider.ip });
          return { id: provider.id, latency };
        } catch (e) {
          console.error(`Ping failed for ${provider.name}:`, e);
          return { id: provider.id, latency: 999 };
        }
      })
    );

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        newLatencies[result.value.id] = result.value.latency;
      }
    });
    
    setLatencies(newLatencies);
    
    const systemDns = DNS_PROVIDERS.find(p => p.id === 'system');
    const otherDns = DNS_PROVIDERS.filter(p => p.id !== 'system').sort((a, b) => 
      (newLatencies[a.id] || 999) - (newLatencies[b.id] || 999)
    );
    
    const sorted = systemDns ? [systemDns, ...otherDns] : otherDns;
    setSortedProviders(sorted);
    
    if (forceSelectBest || config.dnsMode === 'auto') {
      const bestDns = otherDns[0];
      if (bestDns) {
        updateConfig('selectedDns', bestDns.id);
      }
    }

    setIsChecking(false);
  };

  const runDnsBenchmark = async () => {
    setIsBenchmarking(true);
    setDnsTestResult(null);
    try {
      const result = await invoke('dns_benchmark');
      if (result?.results?.length > 0) {
        const latencyMap = {};
        result.results.forEach(r => { latencyMap[r.provider] = r.latency_ms; });
        setLatencies(latencyMap);
        setDnsTestResult(result);

        const fastest = result.results.find(r => r.reachable);
        if (fastest && (config.dnsMode === 'auto' || config.selectedDns === 'system')) {
          updateConfig('selectedDns', fastest.provider);
        }
      }
    } catch (e) {
      console.error('DNS benchmark failed:', e);
    }
    setIsBenchmarking(false);
  };

  const handleFixInternet = async () => {
    if (fixStatus === 'fixing') return; // P2-FIX: Rapid click guard
    setFixStatus('fixing');
    try {
      await invoke('clear_system_proxy');
      
      // P1-FIX: Ana ekrandaki bağlantı durumunu eşzamanlı güncelle
      window.dispatchEvent(new CustomEvent('docspi-force-disconnect', {
        detail: { reason: 'manual-fix' }
      }));
      
      setFixStatus('fixed');
      setTimeout(() => setFixStatus('idle'), 2000);
    } catch (e) {
      console.error('Fix failed:', e);
      setFixStatus('error');
      setTimeout(() => setFixStatus('idle'), 2000);
    }
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="v2-settings-overlay">
      {/* Header */}
      <div className="v2-settings-header">
        <button className="v2-back-btn" onClick={onBack}>
          <ChevronLeft size={28} />
        </button>
        <h1>{t.settingsTitle}</h1>
      </div>

      {/* Scrollable Content */}
      <div className="v2-settings-content" ref={scrollRef}>
        {!isAdmin && (
          <div style={{
            margin: '0 1.25rem 1rem',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldAlert size={20} color="#f59e0b" />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', margin: 0 }}>Kullanıcı Modu Aktif</h4>
              <p style={{ fontSize: '0.72rem', color: '#d4a14a', margin: '2px 0 0', lineHeight: 1.4 }}>
                Yönetici izni olmadan çalışıyorsunuz. Bazı gelişmiş özellikler (Güçlü Mod, Oyun Modu) kısıtlanmıştır.
              </p>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          
          {/* ================= GENERAL TAB ================= */}
          {activeTab === 'general' && (
            <motion.div
              key="general-tab"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={s.section}
            >
              {/* ========== 1. DİL (En üstte) ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.language}</div>
                <p style={s.itemDesc}>{t.languageDesc}</p>
                <div style={{ 
                  ...s.card,
                  maxHeight: '320px', overflowY: 'auto', scrollbarWidth: 'thin',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)'
                }}>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <div 
                      key={l.code}
                      className={`v2-item hover-effect ${lang === l.code ? 'v2-selected' : ''}`}
                      style={{ 
                        ...s.item,
                        background: lang === l.code ? 'rgba(124, 58, 237, 0.15)' : '#0f172a',
                        opacity: lang === l.code ? 1 : 0.7,
                        cursor: 'pointer',
                        padding: '10px 12px',
                        border: 'none',
                      }}
                      onClick={() => updateConfig('language', l.code)}
                    >
                      <div className="v2-icon blue" style={{ 
                        ...s.icon,
                        background: lang === l.code ? 'rgba(124, 58, 237, 0.25)' : 'rgba(255, 255, 255, 0.05)', 
                        width: '32px', height: '32px', minWidth: '32px', borderRadius: '8px' 
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                      </div>
                      <div style={s.itemText}>
                        <h3 style={{ 
                          ...s.itemTitle,
                          color: lang === l.code ? '#a78bfa' : '#e2e8f0', 
                          fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                        }}>{l.name}</h3>
                      </div>
                      {lang === l.code && (
                        <Check size={14} color="#a78bfa" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ========== 6. ISP DURUMU ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>ISP & BAGLANTI DURUMU</div>
                <div style={{ ...s.card, padding: '0' }}>
                  {autoDetectResult ? (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* ISP Bilgisi */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px',
                        background: 'rgba(124, 58, 237,0.06)',
                        borderRadius: '10px',
                        border: '1px solid rgba(124, 58, 237,0.15)',
                      }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(124, 58, 237,0.15)',
                          flexShrink: 0,
                        }}>
                          <Globe size={18} color="#a78bfa" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0' }}>
                            {autoDetectResult.isp?.display_name || detectedIsp || 'Bilinmiyor'}
                          </div>
                          <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px' }}>
                            {autoDetectResult.isp?.region || ''}{autoDetectResult.isp?.region && autoDetectResult.isp?.connection_type ? ' · ' : ''}{autoDetectResult.isp?.connection_type || ''}
                          </div>
                        </div>
                        <div style={{
                          padding: '3px 8px', borderRadius: '6px',
                          fontSize: '0.6rem', fontWeight: '600',
                          background: dpiSeverity === 'aggressive' ? 'rgba(239,68,68,0.15)' : dpiSeverity === 'moderate' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                          color: dpiSeverity === 'aggressive' ? '#f87171' : dpiSeverity === 'moderate' ? '#fbbf24' : '#4ade80',
                          border: dpiSeverity === 'aggressive' ? '1px solid rgba(239,68,68,0.2)' : dpiSeverity === 'moderate' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(34,197,94,0.2)',
                          textTransform: 'uppercase',
                        }}>
                          {dpiSeverity === 'aggressive' ? 'Agir DPI' : dpiSeverity === 'moderate' ? 'Orta DPI' : dpiSeverity === 'mild' ? 'Hafif DPI' : 'Bilinmiyor'}
                        </div>
                      </div>

                      {/* Strateji ve DNS */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{
                          flex: 1, padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Strateji</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>
                            {autoDetectResult.strategy === '0' ? 'Turbo' : autoDetectResult.strategy === '1' ? 'Dengeli' : autoDetectResult.strategy === '2' ? 'Guclu' : 'Otomatik'}
                          </div>
                        </div>
                        <div style={{
                          flex: 1, padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Birincil DNS</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase' }}>
                            {autoDetectResult.dns || 'Sistem'}
                          </div>
                        </div>
                        <div style={{
                          flex: 1, padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Mod</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>
                            {autoDetectResult.network_mode === 'game' ? 'Oyun' : autoDetectResult.network_mode === 'super' ? 'Super' : 'Akici'}
                          </div>
                        </div>
                      </div>

                      {/* DNS Fallback Chain */}
                      {autoDetectResult.fallback_dns_chain?.length > 0 && (
                        <div style={{
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>DNS Fallback Zinciri</div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {autoDetectResult.fallback_dns_chain.map((dns, i) => (
                              <div key={dns} style={{
                                display: 'flex', alignItems: 'center', gap: '2px',
                              }}>
                                <span style={{
                                  padding: '2px 6px', borderRadius: '4px',
                                  fontSize: '0.6rem', fontWeight: 600,
                                  background: i === 0 ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                                  color: i === 0 ? '#4ade80' : '#94a3b8',
                                }}>
                                  {dns.toUpperCase()}
                                </span>
                                {i < autoDetectResult.fallback_dns_chain.length - 1 && (
                                  <span style={{ color: '#475569', fontSize: '0.6rem' }}>&rarr;</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DPI Probes */}
                      {autoDetectResult.dpi?.probes?.length > 0 && (
                        <div style={{
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>DNS Erisim Testi</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                            {autoDetectResult.dpi.probes.map((probe) => (
                              <div key={probe.label} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '4px 6px', borderRadius: '4px',
                                background: 'rgba(255,255,255,0.03)',
                              }}>
                                <div style={{
                                  width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                                  background: probe.reachable ? '#4ade80' : '#ef4444',
                                }} />
                                <span style={{ fontSize: '0.6rem', color: '#cbd5e1', flex: 1 }}>{probe.label}</span>
                                <span style={{
                                  fontSize: '0.55rem', fontWeight: 600,
                                  color: probe.reachable ? '#4ade80' : '#ef4444',
                                }}>
                                  {probe.reachable ? `${probe.latency_ms}ms` : 'Engelli'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                      <ShieldAlert size={24} color="#64748b" style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                        Baglanti tespiti henuz yapilmadi. Uygulamayi baslattiginizda otomatik olarak ISP ve DPI durumunuz tespit edilecek.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ========== 7. DEVICE ACTIVATION ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>DEVICE & ACTIVATION</div>
                <div style={s.card}>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px',
                      background: isActivated ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      border: isActivated ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isActivated ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                        color: isActivated ? '#4ade80' : '#71717a',
                        flexShrink: 0,
                      }}>
                        <Shield size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.75rem', fontWeight: '600',
                          color: isActivated ? '#4ade80' : '#a1a1aa',
                        }}>
                          {isActivated ? 'Activated' : 'Not Activated'}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#52525b', marginTop: '2px', fontFamily: 'monospace' }}>
                          {deviceId}
                        </div>
                      </div>
                      <button
                        onClick={isActivated ? deactivate : activate}
                        style={{
                          padding: '6px 14px', borderRadius: '8px',
                          fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer',
                          background: isActivated ? 'rgba(239,68,68,0.12)' : 'rgba(124, 58, 237,0.12)',
                          color: isActivated ? '#f87171' : '#a78bfa',
                          border: isActivated ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(124, 58, 237,0.2)',
                        }}
                      >
                        {isActivated ? 'Deactivate' : 'Activate Free'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: '#52525b', lineHeight: '1.5', margin: 0 }}>
                      Device-based activation is free and instant. Activate to unlock premium DNS options
                      and support development. All core features remain free regardless of activation status.
                    </p>
                  </div>
                </div>
              </div>

              {/* ========== 4. STATISTICS ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.statsTitle}</div>
                <div style={{ ...s.card, padding: '16px' }}>
                  <div style={s.statsGrid}>
                    <div style={s.statsCard}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase' }}>{t.statsTotalSessions}</p>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{history.totalSessions}</h4>
                    </div>
                    <div style={s.statsCard}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase' }}>{t.statsTotalUptime}</p>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{formatUptime(history.totalUptime)}</h4>
                    </div>
                    <div style={s.statsCard}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase' }}>{t.statsAvgPing}</p>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{history.avgPing ? `${history.avgPing}ms` : '-'}</h4>
                    </div>
                    <div style={s.statsCard}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase' }}>{t.statsMostUsedMode}</p>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, textTransform: 'capitalize' }}>{history.mostUsedMode || '-'}</h4>
                    </div>
                  </div>

                  <div style={{ ...s.divider, margin: '0 0 16px 0' }} />

                  <div style={{ maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                    {history.sessions.length === 0 ? (
                      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '20px 0' }}>{t.statsEmpty}</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {history.sessions.map(s => (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.date}</span>
                              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{s.mode === '0' ? 'Turbo' : s.mode === '1' ? 'Balanced' : 'Strong'}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: '#4ade80', fontWeight: 600 }}>{formatUptime(s.uptime)}</div>
                              {s.ping && <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{s.ping}ms</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {history.sessions.length > 0 && (
                    <button 
                      onClick={resetHistory}
                      style={{ ...s.button, width: '100%', marginTop: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.75rem' }}
                    >
                      {t.statsReset}
                    </button>
                  )}
                </div>
              </div>

              {/* ========== 5. OTOMASYON ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionAutomation}</div>
                <div style={s.card}>
                  <div style={s.item}>
                    <div className="v2-icon yellow"><Zap size={20} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.autoConnect}</h3>
                      <p style={s.itemDesc}>{t.autoConnectDesc}</p>
                    </div>
                    <Toggle checked={config.autoConnect} onChange={(v) => updateConfig('autoConnect', v)} />
                  </div>

                  <div style={s.divider} />

                  <div style={s.item}>
                    <div className="v2-icon green"><RotateCw size={20} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.autoReconnect}</h3>
                      <p style={s.itemDesc}>{t.autoReconnectDesc}</p>
                    </div>
                    <Toggle checked={config.autoReconnect} onChange={(v) => updateConfig('autoReconnect', v)} />
                  </div>
                </div>
              </div>

              {/* ========== 6. GENEL ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionGeneral}</div>
                <div style={s.card}>
                  
                  <div style={s.item}>
                    <div className="v2-icon green"><Power size={20} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.autoStart}</h3>
                      <p style={s.itemDesc}>{t.autoStartDesc}</p>
                    </div>
                    <Toggle checked={autostartEnabled} onChange={toggleAutostart} />
                  </div>

                  <div style={s.divider} />

                  <div style={s.item}>
                    <div className="v2-icon gray"><ChevronLeft size={20} style={{transform:'rotate(-90deg)'}} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.minimizeToTray}</h3>
                      <p style={s.itemDesc}>{t.minimizeToTrayDesc}</p>
                    </div>
                    <Toggle checked={config.minimizeToTray} onChange={(v) => updateConfig('minimizeToTray', v)} />
                  </div>

                  <div style={s.divider} />

                  <div style={s.item}>
                    <div className="v2-icon blue"><Pin size={20} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.alwaysOnTop || 'Her Şeyin Üzerinde Tut'}</h3>
                      <p style={s.itemDesc}>{t.alwaysOnTopDesc || 'Pencere her zaman diğer pencerelerin üzerinde kalır'}</p>
                    </div>
                    <Toggle checked={config.alwaysOnTop || false} onChange={(v) => updateConfig('alwaysOnTop', v)} />
                  </div>

                  <div style={s.divider} />

                  <div style={s.item}>
                    <div className="v2-icon yellow" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}><AlertTriangle size={20} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.requireConfirmation}</h3>
                      <p style={s.itemDesc}>{t.requireConfirmationDesc}</p>
                    </div>
                    <Toggle checked={config.requireConfirmation !== false} onChange={(v) => updateConfig('requireConfirmation', v)} />
                  </div>

                  <div style={s.divider} />

                  <div style={{ ...s.item, flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div className="v2-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}><Sun size={20} /></div>
                      <div style={{ ...s.itemText, flex: 1 }}>
                        <h3 style={s.itemTitle}>{t.themeLabel || 'Tema'}</h3>
                        <p style={s.itemDesc}>{themeName === 'dark' ? (t.themeDarkDesc || 'Koyu tema aktif') : (t.themeLightDesc || 'Açık tema aktif')}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', width: '100%', paddingLeft: '36px' }}>
                      <button
                        onClick={() => { if (themeName !== 'dark') { toggleTheme(); updateConfig('theme', 'dark'); } }}
                        style={{
                          ...s.button,
                          flex: 1, padding: '10px 12px', border: `1px solid ${themeName === 'dark' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                          background: themeName === 'dark' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.03)',
                          color: themeName === 'dark' ? '#a855f7' : '#a1a1aa',
                          fontSize: '0.8rem',
                        }}
                      >
                        <Moon size={14} /> {t.themeDark || 'Koyu'}
                      </button>
                      <button
                        onClick={() => { if (themeName !== 'light') { toggleTheme(); updateConfig('theme', 'light'); } }}
                        style={{
                          ...s.button,
                          flex: 1, padding: '10px 12px', border: `1px solid ${themeName === 'light' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                          background: themeName === 'light' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.03)',
                          color: themeName === 'light' ? '#a855f7' : '#a1a1aa',
                          fontSize: '0.8rem',
                        }}
                      >
                        <Sun size={14} /> {t.themeLight || 'Açık'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* ========== PROFIL AYARLARI ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionProfiles}</div>
                <div style={{ ...s.card, padding: '1rem' }}>
                  <p style={{ ...s.itemDesc, marginBottom: '0.75rem', lineHeight: '1.5' }}>{t.sectionProfilesDesc}</p>

                  {profileFeedback && (
                    <div style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: '0.75rem', textAlign: 'center' }}>
                      {profileFeedback === 'saved' ? t.profileSaved : profileFeedback === 'exported' ? 'Profil JSON panoya kopyalandi' : profileFeedback === 'imported' ? 'Profil(ler) iceri aktarildi' : t.profileLoaded}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={e => setProfileNameInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveProfile()}
                      placeholder={t.profileName}
                      style={{ ...s.input, flex: 1, minWidth: 0 }}
                    />
                    <button
                      onClick={handleSaveProfile}
                      style={{
                        ...s.button,
                        background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.3)',
                        color: '#a78bfa', padding: '8px 16px', whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      {t.profileSaveShort}
                    </button>
                  </div>

                  {savedProfiles.length === 0 ? (
                    <p style={{ ...s.itemDesc, textAlign: 'center', padding: '0.5rem 0' }}>{t.profileEmpty}</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {savedProfiles.map(profile => (
                        <div key={profile.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 10px',
                        }}>
                          <span style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: '600', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</span>
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button
                              onClick={() => handleLoadProfile(profile)}
                              style={{ ...s.button, padding: '3px 10px', background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: '0.72rem' }}
                            >
                              {t.profileLoad}
                            </button>
                            <button
                              onClick={() => deleteProfile?.(profile.id)}
                              style={{ ...s.button, padding: '3px 8px', background: 'rgba(239,68,68,0.12)', color: '#f87171', fontSize: '0.72rem' }}
                            >
                              {t.profileDelete}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Export/Import Buttons */}
                  {savedProfiles.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={async () => {
                          try {
                            const json = JSON.stringify(savedProfiles, null, 2);
                            const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
                            await writeText(json);
                            setProfileFeedback('exported');
                            setTimeout(() => setProfileFeedback(null), 2000);
                          } catch (e) {
                            // clipboard yoksa fallback: blob indir
                            const json = JSON.stringify(savedProfiles, null, 2);
                            const blob = new Blob([json], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = 'docspi-profiles.json'; a.click();
                            URL.revokeObjectURL(url);
                            setProfileFeedback('exported');
                            setTimeout(() => setProfileFeedback(null), 2000);
                          }
                        }}
                        style={{
                          ...s.button, flex: 1, padding: '8px',
                          background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)',
                          color: '#a855f7', fontSize: '0.72rem',
                        }}
                      >
                        <Copy size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Export JSON
                      </button>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file'; input.accept = '.json';
                          input.onchange = async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const text = await file.text();
                              const imported = JSON.parse(text);
                              if (!Array.isArray(imported)) throw new Error('Gecersiz format');
                              const existing = [...savedProfiles];
                              let count = 0;
                              for (const p of imported) {
                                if (p.name && p.id && Array.isArray(p.config || p.domains || [])) {
                                  if (!existing.find(e => e.id === p.id)) {
                                    existing.push(p);
                                    count++;
                                  }
                                }
                              }
                              if (count > 0) {
                                localStorage.setItem('docspi_saved_profiles', JSON.stringify(existing));
                                // Update parent state via savedProfiles setter — refresh sayfada gecerli
                                window.location.reload();
                              } else {
                                setProfileFeedback('noNew');
                                setTimeout(() => setProfileFeedback(null), 2000);
                              }
                            } catch (err) {
                              setProfileFeedback('importError');
                              setTimeout(() => setProfileFeedback(null), 2000);
                            }
                          };
                          input.click();
                        }}
                        style={{
                          ...s.button, flex: 1, padding: '8px',
                          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
                          color: '#4ade80', fontSize: '0.72rem',
                        }}
                      >
                        <FileText size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Import JSON
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}


          {/* ================= NETWORK TAB ================= */}
          {activeTab === 'network' && (
            <motion.div
              key="network-tab"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={s.section}
            >
              {/* ========== 1. İSS AKILLI REHBERİ (PREMIUM UX) ========== */}
              <div style={s.section}>
                <div style={{ ...s.sectionTitle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} /> {t.issGuideTitle}
                </div>
                
                <div style={{
                  ...s.card,
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {ISP_PROFILES.filter(p => p.id !== 'other').map((isp) => {
                    const nameKey = `iss${isp.id.charAt(0).toUpperCase() + isp.id.slice(1)}Name`;
                    const descKey = `iss${isp.id.charAt(0).toUpperCase() + isp.id.slice(1)}Desc`;
                    const ICON_MAP = { light: <Activity size={18} />, mid: <Zap size={18} />, heavy: <Shield size={18} /> };
                    const ispData = {
                      ...isp,
                      name: t[nameKey] || isp.id,
                      desc: t[descKey] || '',
                      icon: ICON_MAP[isp.id] || <Globe size={18} />,
                    };
                    const isApplied = config.dpiMethod === ispData.mode && 
                                     Number(config.httpsChunkSize) === Number(ispData.chunk);
                    const isExpanded = expandedISP === ispData.id;

                    return (
                      <div 
                        key={ispData.id} 
                        style={{ 
                          background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent',
                          borderRadius: '12px',
                          border: isExpanded ? `1px solid ${ispData.bg}` : '1px solid transparent',
                          transition: 'all 0.3s ease',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Başlık / Tıklanabilir Alan */}
                        <div
                          onClick={() => setExpandedISP(isExpanded ? null : ispData.id)}
                          style={{ 
                            padding: '12px 14px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            cursor: 'pointer' 
                          }}
                        >
                          <div style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: ispData.bg, color: ispData.color
                          }}>
                            {ispData.iconType === 'zap' && <Zap size={18} />}
                            {ispData.iconType === 'lock' && <Lock size={18} />}
                            {ispData.iconType === 'shield' && <Shield size={18} />}
                            {ispData.iconType === 'shield-alert' && <ShieldAlert size={18} />}
                            {ispData.iconType === 'globe' && <Globe size={18} />}
                            {!ispData.iconType && <Activity size={18} />}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600 }}>{ispData.name}</h4>
                            {ispData.logos && ispData.logos.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', marginBottom: '2px', alignItems: 'center' }}>
                                {ispData.logos.map((logo, idx) => (
                                  <img key={idx} src={logo} alt="ISP Logo" style={{ height: '14px', opacity: 0.7, filter: 'grayscale(0.3)' }} />
                                ))}
                              </div>
                            )}
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                              {isApplied ? <span style={{ color: ispData.color, fontWeight: 600 }}>{t.issProfileActive}</span> : t.issProfileSee}
                            </p>
                          </div>

                          <ChevronLeft 
                            size={18} color="#64748b" 
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)', transition: 'transform 0.3s ease' }} 
                          />
                        </div>
                        
                        {/* Animasyonlu İçerik */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }} 
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '0 14px 14px 60px' }}>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5, margin: '0 0 12px 0' }}>{ispData.desc}</p>

                                {!isApplied ? (
                                  <button
                                    onClick={() => {
                                      updateConfig({
                                        dpiMethod: ispData.mode,
                                        httpsChunkSize: ispData.chunk,
                                        selectedIspProfile: ispData.id
                                      });
                                    }}
                                    style={{ 
                                      background: ispData.color, color: '#000', border: 'none', 
                                      padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', 
                                      fontWeight: 700, cursor: 'pointer', display: 'flex', 
                                      alignItems: 'center', gap: '6px', boxShadow: `0 4px 12px ${ispData.bg}`,
                                      transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                  >
                                    <Check size={16} /> {t.issApplyBtn}
                                  </button>
                                ) : (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#cbd5e1', fontSize: '0.75rem' }}>
                                    <Check size={14} color={ispData.color} /> {t.issAppliedMsg}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ========== 2. MANUEL BAĞLANTI YÖNTEMİ ========== */}
              <div style={s.section}>
                <div style={{ ...s.sectionTitle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t.sectionBypass}</span>
                  <BypassTest proxyPort={proxyPort} />
                </div>
                <div style={s.card}>
                    {/* Turbo Mod */}
                    <div 
                      className={`v2-item hover-effect ${config.dpiMethod === '0' ? 'v2-selected' : ''}`}
                      style={{ ...s.item, background: config.dpiMethod === '0' ? 'rgba(234, 179, 8, 0.1)' : 'transparent', opacity: config.dpiMethod === '0' ? 1 : 0.5, cursor: 'pointer' }}
                      onClick={() => { updateConfig({ dpiMethod: '0', httpsChunkSize: 4, selectedIspProfile: 'custom' }); }}
                    >
                      <div className="v2-icon yellow" style={{ ...s.icon, background: config.dpiMethod === '0' ? 'rgba(234, 179, 8, 0.2)' : '' }}>
                        <Activity size={20} className={config.dpiMethod === '0' ? 'active-icon' : ''} />
                      </div>
                      <div style={s.itemText}>
                        <h3 style={{ ...s.itemTitle, color: config.dpiMethod === '0' ? '#facc15' : '' }}>{t.modeTurboName}</h3>
                        <p style={s.itemDesc}>{t.modeTurboDesc}</p>
                      </div>
                      <div className={`v2-radio ${config.dpiMethod === '0' ? 'on' : ''}`}>
                         {config.dpiMethod === '0' && <div className="v2-radio-dot" />}
                      </div>
                    </div>

                    <div style={s.divider} />

                    {/* Dengeli Mod */}
                    <div 
                      className={`v2-item hover-effect ${config.dpiMethod === '1' ? 'v2-selected' : ''}`}
                      style={{ ...s.item, background: config.dpiMethod === '1' ? 'rgba(34, 197, 94, 0.1)' : 'transparent', opacity: config.dpiMethod === '1' ? 1 : 0.5, cursor: 'pointer' }}
                      onClick={() => { updateConfig({ dpiMethod: '1', httpsChunkSize: 2, selectedIspProfile: 'custom' }); }}
                    >
                      <div className="v2-icon green" style={{ ...s.icon, background: config.dpiMethod === '1' ? 'rgba(34, 197, 94, 0.2)' : '' }}>
                        <Zap size={20} className={config.dpiMethod === '1' ? 'active-icon' : ''} />
                      </div>
                      <div style={s.itemText}>
                        <h3 style={{ ...s.itemTitle, color: config.dpiMethod === '1' ? '#4ade80' : '' }}>{t.modeBalancedName}</h3>
                        <p style={s.itemDesc}>{t.modeBalancedDesc}</p>
                      </div>
                      <div className={`v2-radio ${config.dpiMethod === '1' ? 'on' : ''}`}>
                         {config.dpiMethod === '1' && <div className="v2-radio-dot" />}
                      </div>
                    </div>

                    <div style={s.divider} />

                   {/* Güçlü Mod*/}
                    <div 
                      className={`v2-item hover-effect ${config.dpiMethod === '2' ? 'v2-selected' : ''}`}
                      style={{ 
                        ...s.item,
                        background: config.dpiMethod === '2' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                        opacity: !isAdmin ? 0.4 : (config.dpiMethod === '2' ? 1 : 0.5),
                        cursor: !isAdmin ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => { 
                        if (!isAdmin) return;
                        updateConfig({ dpiMethod: '2', httpsChunkSize: 1, selectedIspProfile: 'custom' }); 
                      }}
                    >
                      <div className="v2-icon blue" style={{ ...s.icon, background: config.dpiMethod === '2' ? 'rgba(124, 58, 237, 0.2)' : '' }}>
                        {!isAdmin ? <Lock size={18} /> : <Shield size={20} className={config.dpiMethod === '2' ? 'active-icon' : ''} />}
                      </div>
                      <div style={s.itemText}>
                        <h3 style={{ ...s.itemTitle, color: config.dpiMethod === '2' ? '#a78bfa' : '' }}>{t.modeStrongName}</h3>
                        <p style={s.itemDesc}>{!isAdmin ? 'Yönetici izni gerektirir' : t.modeStrongDesc}</p>
                      </div>
                      <div className={`v2-radio ${config.dpiMethod === '2' ? 'on' : ''}`}>
                         {config.dpiMethod === '2' && <div className="v2-radio-dot" />}
                      </div>
                    </div>

                    {/* Npcap Gelişmiş Bypass — Güçlü Mod altında */}
                    <AnimatePresence>
                      {config.dpiMethod === '2' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="v2-divider" />
                          {driverInstalled ? (
                            <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div 
                                className="v2-item" 
                                style={{ padding: 0 }}
                              >
                                <div className="v2-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', width: '32px', height: '32px', minWidth: '32px' }}>
                                  <Shield size={16} />
                                </div>
                                <div className="v2-item-text">
                                  <h3 style={{ color: config.advancedBypass !== false ? '#d8b4fe' : '', fontSize: '0.85rem' }}>{t.advancedFeaturesToggle}</h3>
                                  <p style={{ fontSize: '0.7rem' }}>{t.advancedFeaturesToggleDesc} {driverInfo.version !== 'N/A' && <span style={{ color: '#a855f7', fontWeight: 600 }}>(v{driverInfo.version})</span>}</p>
                                </div>
                                <Toggle checked={config.advancedBypass !== false && config.networkMode !== 'smooth'} onChange={(v) => config.networkMode !== 'smooth' && updateConfig('advancedBypass', v)} disabled={config.networkMode === 'smooth'} />
                              </div>

                              <div className="v2-divider" style={{ opacity: 0.1, margin: '8px 0' }} />

                              <div className="v2-item" style={{ padding: 0 }}>
                                <div className="v2-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed', width: '32px', height: '32px', minWidth: '32px' }}>
                                  <Monitor size={16} />
                                </div>
                                <div className="v2-item-text">
                                  <h3 style={{ fontSize: '0.85rem' }}>{t.fakeSniLabel || 'Fake SNI Domain'}</h3>
                                  <input 
                                    type="text" 
                                    value={config.fakeSni || 'www.google.com'} 
                                    onChange={(e) => updateConfig('fakeSni', e.target.value)}
                                    style={{ 
                                      width: '100%', padding: '4px 8px', borderRadius: '6px', 
                                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                      color: '#c4b5fd', fontSize: '0.75rem', marginTop: '4px', outline: 'none'
                                    }}
                                  />
                                </div>
                              </div>

                              {needsRestart && (
                                <div style={{ 
                                  display: 'flex', alignItems: 'center', gap: '6px',
                                  padding: '6px 10px', borderRadius: '6px',
                                  background: 'rgba(251, 146, 60, 0.08)', 
                                  border: '1px solid rgba(251, 146, 60, 0.15)'
                                }}>
                                  <AlertTriangle size={12} color="#fb923c" />
                                  <span style={{ fontSize: '0.65rem', color: '#fb923c', fontWeight: 500 }}>
                                    {t.npcapRestartWarning}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ padding: '6px 16px 10px' }}>
                              {/* Subtle hint pill */}
                              <div 
                                onClick={() => setShowNpcapDetails(!showNpcapDetails)}
                                style={{ 
                                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                  cursor: 'pointer', padding: '5px 10px',
                                  borderRadius: '8px',
                                  background: 'rgba(245, 158, 11, 0.06)',
                                  border: '1px solid rgba(245, 158, 11, 0.12)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.06)';
                                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.12)';
                                }}
                              >
                                <Zap size={11} color="#f59e0b" />
                                <span style={{ fontSize: '0.68rem', color: '#d4a14a', fontWeight: 500 }}>
                                  {t.advancedNpcapHint}
                                </span>
                                <ChevronDown size={11} color="#d4a14a" style={{ 
                                  transform: showNpcapDetails ? 'rotate(180deg)' : 'rotate(0)', 
                                  transition: 'transform 0.2s',
                                  marginLeft: '2px'
                                }} />
                              </div>

                              {/* Açılabilir detay */}
                              <AnimatePresence>
                                {showNpcapDetails && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t.advancedNpcapWhy}</p>
                                      <motion.button 
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={async () => {
                                          try {
                                            await invoke('install_driver');
                                            const installed = await invoke('check_driver');
                                            setDriverInstalled(installed);
                                            if (installed) setNeedsRestart(true);
                                          } catch (e) {
                                            console.error('Driver install failed:', e);
                                          }
                                        }} 
                                        style={{ 
                                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                          color: '#000', border: 'none', padding: '8px 12px', borderRadius: '8px', 
                                          fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer',
                                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          gap: '6px', width: '100%', textTransform: 'uppercase', letterSpacing: '0.5px',
                                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                                        }}
                                      >
                                        <Wrench size={13} />
                                        {t.advancedNpcapInstallBtn}
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chunk size Seçimi */}
                    {(config.dpiMethod === '1' || config.dpiMethod === '2') && (
                      <>
                        <div className="v2-divider" />
                        <div style={{ display: 'flex', width: '100%', padding: '6px 12px', boxSizing: 'border-box' }}>
                          {CHUNK_SIZES.map((opt) => {
                            const fallbackChunk = DEFAULT_CHUNKS[config.dpiMethod] || 2;
                            const isSelected = Number(config.httpsChunkSize || fallbackChunk) === opt.value;
                            const accentColor = config.dpiMethod === '2' ? '#a78bfa' : '#4ade80';
                            const accentBg = config.dpiMethod === '2' ? 'rgba(124, 58, 237, 0.18)' : 'rgba(34, 197, 94, 0.18)';
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateConfig({ httpsChunkSize: opt.value, selectedIspProfile: 'custom' })}
                                style={{
                                  flex: 1, height: '32px', border: 'none', margin: '0 4px', borderRadius: '6px',
                                  background: isSelected ? accentBg : 'rgba(255, 255, 255, 0.03)',
                                  color: isSelected ? accentColor : '#94a3b8',
                                  fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                </div>
              </div>

              {/* ========== 3. EKSTRA AĞ AYARLARI ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionExtraNetwork}</div>
                <div style={s.card}>

                  <div style={{ ...s.item, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="v2-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                      <Activity size={20} />
                    </div>
                    <div style={s.itemText}>
                      <h3 style={{ ...s.itemTitle, color: '#fca5a5' }}>{t.ipv4ForceTitle}</h3>
                      <p style={s.itemDesc}>{t.ipv4ForceDesc}</p>
                    </div>
                    <Toggle checked={config.ipv4Only !== false} onChange={(v) => updateConfig('ipv4Only', v)} />
                  </div>

                  <div style={{ padding: '14px 16px 10px' }}>
                    <p style={{ ...s.itemDesc, marginBottom: '12px', lineHeight: 1.5 }}>
                      {t.networkModeLabel}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                      {[
                        {
                          id: 'smooth',
                          icon: Zap,
                          color: '#facc15',
                          bg: 'rgba(250, 204, 21, 0.08)',
                          border: 'rgba(250, 204, 21, 0.25)',
                          title: t.modeSmooth,
                          desc: t.modeSmoothDesc,
                          needsNpcap: false,
                        },
                        {
                          id: 'game',
                          icon: Gamepad2,
                          color: '#4ade80',
                          bg: 'rgba(74, 222, 128, 0.08)',
                          border: 'rgba(74, 222, 128, 0.25)',
                          title: t.modeGame,
                          desc: t.modeGameDesc,
                          needsNpcap: false,
                          needsAdmin: true,
                        },
                        {
                          id: 'super',
                          icon: Sparkles,
                          color: '#a78bfa',
                          bg: 'rgba(167, 139, 250, 0.08)',
                          border: 'rgba(167, 139, 250, 0.25)',
                          title: t.modeSuper,
                          desc: t.modeSuperDesc,
                          needsNpcap: false,
                          needsAdmin: true,
                        },
                      ].map((mode) => {
                        const isActive = (config.networkMode || 'smooth') === mode.id;
                        const isLocked = mode.needsAdmin && !isAdmin;
                        const Icon = mode.icon;
                        return (
                          <div
                            key={mode.id}
                            onClick={() => {
                              if (isLocked) return;
                              if (mode.needsNpcap && !driverInstalled) {
                                setShowNpcapDetails(true);
                                return;
                              }
                              updateConfig('networkMode', mode.id);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 12px',
                              borderRadius: '12px',
                              border: `1px solid ${isActive ? mode.border : 'rgba(255,255,255,0.06)'}`,
                              background: isActive ? mode.bg : 'rgba(255,255,255,0.02)',
                              cursor: isLocked ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: isLocked ? 0.4 : ((!isActive && mode.needsNpcap && !driverInstalled) ? 0.5 : 1),
                            }}
                          >
                            <Icon size={20} color={isActive ? mode.color : '#94a3b8'} style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? mode.color : '#e2e8f0' }}>
                                  {mode.title}
                                </span>
                                {mode.needsNpcap && !driverInstalled && (
                                  <span style={{ fontSize: '0.65rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '4px', padding: '1px 5px', fontWeight: 600 }}>
                                    Npcap
                                  </span>
                                )}
                                {isLocked && (
                                  <Lock size={12} color="#f87171" />
                                )}
                              </div>
                              <p style={{ fontSize: '0.72rem', color: isActive ? '#94a3b8' : '#52525b', margin: '2px 0 0', lineHeight: 1.4 }}>
                                {isLocked ? 'Yönetici izni gerektirir' : mode.desc}
                              </p>
                            </div>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${isActive ? mode.color : 'rgba(255,255,255,0.15)'}`,
                              background: isActive ? mode.color : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}>
                              {isActive && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#000' }} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>
              </div>



              {/* ========== 2. AĞ AYARLARI ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionNetwork}</div>
                <div style={s.card}>
                  <div style={s.item}>
                    <div className="v2-icon purple" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
                      <Globe size={20} />
                    </div>
                    <div style={s.itemText}>
                      <h3 style={{ ...s.itemTitle, color: '#d8b4fe', opacity: !isAdmin ? 0.5 : 1 }}>
                        {t.lanSharing} {!isAdmin && <Lock size={12} style={{ marginLeft: '4px' }} />}
                      </h3>
                      <p style={{ ...s.itemDesc, opacity: !isAdmin ? 0.5 : 1 }}>
                        {!isAdmin ? 'Yönetici izni gerektirir (Güvenlik Duvarı ayarları için)' : t.lanSharingDesc}
                      </p>
                    </div>
                    <Toggle 
                      checked={isAdmin && (config.lanSharing || false)} 
                      onChange={(v) => isAdmin && updateConfig('lanSharing', v)} 
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
              </div>

              {/* ========== ÖZEL DOMAIN LİSTESİ ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionDomains}</div>
                <div style={{ ...s.card, padding: '1rem' }}>
                  <p style={{ ...s.itemDesc, marginBottom: '0.75rem', lineHeight: '1.5' }}>{t.sectionDomainsDesc}</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      value={domainInput}
                      onChange={e => setDomainInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddDomain()}
                      placeholder={t.domainPlaceholder}
                      style={s.input}
                    />
                    <button
                      onClick={handleAddDomain}
                      style={{
                        ...s.button,
                        background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.3)',
                        color: '#a78bfa', padding: '8px 14px',
                      }}
                    >
                      {t.domainAdd}
                    </button>
                  </div>
                  {(config.customDomains || []).length === 0 ? (
                    <p style={{ ...s.itemDesc, textAlign: 'center', padding: '0.5rem 0' }}>{t.domainEmpty}</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {(config.customDomains || []).map(domain => (
                        <div key={domain} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '6px 10px',
                        }}>
                          <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontFamily: 'monospace' }}>{domain}</span>
                          <button
                            onClick={() => handleRemoveDomain(domain)}
                            style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ========== 4. DNS LİSTESİ ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionDns}</div>
                
                <div style={s.card}>
                  {/* Sistem Varsayılanı Toggle */}
                  <div style={s.item}>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.dnsSystemDefault}</h3>
                      <p style={s.itemDesc}>{t.dnsSystemDefaultDesc}</p>
                    </div>
                    <Toggle 
                      checked={config.selectedDns === 'system'} 
                      onChange={(v) => {
                        if (v) {
                          updateConfig('selectedDns', 'system');
                          updateConfig('dnsMode', 'manual');
                        } else {
                          updateConfig('selectedDns', 'cloudflare'); // Varsayılan bir değere geç
                        }
                      }} 
                    />
                  </div>

                  <div style={s.divider} />

                  <div style={{ opacity: config.selectedDns === 'system' ? 0.4 : 1, pointerEvents: config.selectedDns === 'system' ? 'none' : 'auto', transition: 'all 0.3s ease' }}>
                    <div style={s.item}>
                      <div style={s.itemText}>
                        <h3 style={s.itemTitle}>{t.dnsAutoSelect}</h3>
                        <p style={s.itemDesc}>{t.dnsAutoSelectDesc}</p>
                      </div>
                      <Toggle 
                        checked={config.dnsMode === 'auto' && config.selectedDns !== 'system'} 
                        onChange={(v) => {
                          updateConfig('dnsMode', v ? 'auto' : 'manual');
                          if (v) checkAllLatencies(true); 
                        }} 
                      />
                    </div>

                    <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        onClick={checkAllLatencies} 
                        disabled={isChecking}
                        style={{
                          ...s.button,
                          width: '100%',
                          background: isChecking ? 'rgba(124, 58, 237, 0.05)' : 'rgba(124, 58, 237, 0.1)',
                          color: isChecking ? '#c4b5fd' : '#a78bfa',
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                        }}
                      >
                        {isChecking ? <RotateCw size={16} className="spin" /> : <Activity size={16} />}
                        {isChecking ? t.dnsChecking : t.dnsCheckSpeed}
                      </button>
                      <button 
                        onClick={runDnsBenchmark} 
                        disabled={isBenchmarking}
                        style={{
                          ...s.button,
                          width: '100%',
                          background: isBenchmarking ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.1)',
                          color: isBenchmarking ? '#a5b4fc' : '#818cf8',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          fontSize: '0.72rem',
                        }}
                      >
                        {isBenchmarking ? <RotateCw size={16} className="spin" /> : <Zap size={16} />}
                        {isBenchmarking ? 'Benchmarking...' : 'Full DNS Benchmark (Parallel)'}
                      </button>
                    </div>

                    <div style={{ ...s.divider, margin: 0 }} />

                    <div className="v2-dns-list">
                      <AnimatePresence>
                        {sortedProviders.filter(p => p.id !== 'system').map((p) => {
                          const isSelected = config.selectedDns === p.id;
                          const isAutoMode = config.dnsMode === 'auto';
                          const isDisabled = isAutoMode;
                          return (
                            <motion.div 
                              layout
                              key={p.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ 
                                opacity: isDisabled 
                                  ? (isSelected ? 1 : 0.5) 
                                  : (!isSelected ? 0.45 : 1),
                                y: 0 
                              }}
                              whileHover={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              className={`v2-dns-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                              onClick={() => {
                                if (isDisabled) return;
                                updateConfig('selectedDns', p.id);
                              }}
                            >
                              <div className={`v2-radio ${isSelected ? 'on' : ''}`}>
                                {isSelected && <div className="v2-radio-dot" />}
                              </div>
                              <div className="v2-dns-info">
                                <span className="v2-dns-name">{p.name}</span>
                                <span className="v2-dns-desc">{p.desc}</span>
                              </div>
                              {latencies[p.id] ? (
                                <div style={{
                                  display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                                }}>
                                  <div style={{
                                    width: '40px', height: '4px',
                                    background: 'rgba(255,255,255,0.06)',
                                    borderRadius: '2px', overflow: 'hidden',
                                  }}>
                                    <div style={{
                                      width: `${Math.min((latencies[p.id] / 200) * 100, 100)}%`,
                                      height: '100%',
                                      background: latencies[p.id] < 30 ? '#4ade80' :
                                                  latencies[p.id] < 80 ? '#facc15' :
                                                  latencies[p.id] < 150 ? '#fb923c' : '#f87171',
                                      borderRadius: '2px',
                                      transition: 'width 0.5s ease',
                                    }} />
                                  </div>
                                  <span style={{
                                    fontSize: '0.68rem', fontWeight: '600', minWidth: '32px', textAlign: 'right',
                                    color: latencies[p.id] < 30 ? '#4ade80' :
                                           latencies[p.id] < 80 ? '#facc15' :
                                           latencies[p.id] < 150 ? '#fb923c' : '#f87171',
                                  }}>
                                    {latencies[p.id]}ms
                                  </span>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.65rem', color: '#52525b', minWidth: '50px', textAlign: 'right' }}>
                                  ---
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {/* ================= NOTIFICATIONS TAB ================= */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications-tab"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={s.section}
            >
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionNotifications}</div>
                <div style={s.card}>
                  
                  <div style={s.item}>
                    <div className="v2-icon blue" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa' }}><Bell size={20} /></div>
                    <div style={s.itemText}>
                      <h3 style={s.itemTitle}>{t.notifications}</h3>
                      <p style={s.itemDesc}>{t.notificationsDesc}</p>
                    </div>
                    <Toggle checked={config.notifications !== false} onChange={(v) => updateConfig('notifications', v)} />
                  </div>

                  <div style={s.divider} />

                  <div 
                    className="v2-item hover-effect"
                    style={{
                      ...s.item,
                      opacity: config.notifications !== false ? 1 : 0.4,
                      pointerEvents: config.notifications !== false ? 'auto' : 'none',
                      paddingLeft: '1.5rem'
                    }}
                    onClick={() => {
                       if (config.notifications !== false) {
                          updateConfig('notifyOnConnect', config.notifyOnConnect !== false ? false : true);
                       }
                    }}
                  >
                    <div className="v2-icon green" style={{ width: '30px', height: '30px', borderRadius: '8px' }}>
                       <Check size={16} />
                    </div>
                    <div style={s.itemText}>
                      <h3 style={{ ...s.itemTitle, fontSize: '0.85rem' }}>{t.notifyOnConnect}</h3>
                      <p style={s.itemDesc}>{t.notifyOnConnectDesc}</p>
                    </div>
                    <Toggle checked={config.notifyOnConnect !== false} onChange={(v) => updateConfig('notifyOnConnect', v)} />
                  </div>

                  <div style={{ ...s.divider, marginLeft: '3.5rem' }} />

                  <div 
                    className="v2-item hover-effect"
                    style={{
                      ...s.item,
                      opacity: config.notifications !== false ? 1 : 0.4,
                      pointerEvents: config.notifications !== false ? 'auto' : 'none',
                      paddingLeft: '1.5rem'
                    }}
                    onClick={() => {
                       if (config.notifications !== false) {
                          updateConfig('notifyOnDisconnect', config.notifyOnDisconnect !== false ? false : true);
                       }
                    }}
                  >
                    <div className="v2-icon yellow" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', width: '30px', height: '30px', borderRadius: '8px' }}>
                       <AlertTriangle size={16} />
                    </div>
                    <div style={s.itemText}>
                      <h3 style={{ ...s.itemTitle, fontSize: '0.85rem' }}>{t.notifyOnDisconnect}</h3>
                      <p style={s.itemDesc}>{t.notifyOnDisconnectDesc}</p>
                    </div>
                    <Toggle checked={config.notifyOnDisconnect !== false} onChange={(v) => updateConfig('notifyOnDisconnect', v)} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {/* ================= SYSTEM TAB ================= */}
          {activeTab === 'system' && (
            <motion.div
              key="system-tab"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={s.section}
            >
              {/* ========== GUNCELLEME ========== */}
              <UpdatePanel />

              {/* ========== 7. SORUN GİDERME ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionTroubleshoot}</div>
                <div style={{ 
                  ...s.card,
                  background: fixStatus === 'fixing' ? '#b45309' : fixStatus === 'fixed' ? '#10b981' : fixStatus === 'error' ? '#ef4444' : '#002c1dff', 
                  border: 'none',
                }}>
                  <div className="v2-item hover-effect" onClick={handleFixInternet} style={{ ...s.item, cursor: fixStatus === 'idle' ? 'pointer' : 'default' }}>
                     <div className="v2-icon" style={{ 
                       ...s.icon,
                       color: fixStatus === 'fixing' ? '#b45309' : fixStatus === 'fixed' ? '#10b981' : fixStatus === 'error' ? '#ef4444' : '#10b981', 
                       background: '#ffffff',
                     }}>
                       <Wrench size={20} className={fixStatus === 'fixing' ? 'spinning-slow' : ''} />
                     </div>
                      <div style={s.itemText}>
                        <h3 style={{ ...s.itemTitle, color: '#ffffff' }}>
                          {fixStatus === 'fixing' ? t.fixRepairing : fixStatus === 'fixed' ? t.fixDone : fixStatus === 'error' ? t.fixError : t.fixInternet}
                        </h3>
                        <p style={{ ...s.itemDesc, color: 'rgba(255, 255, 255, 0.82)' }}>
                          {fixStatus === 'fixing' ? t.fixRepairingDesc : fixStatus === 'fixed' ? t.fixDoneDesc : fixStatus === 'error' ? t.fixErrorDesc : t.fixInternetDesc}
                        </p>
                      </div>
                     <div style={{ padding: '0 0.5rem' }}>
                       {fixStatus === 'fixing' && <RotateCw size={20} className="spinning" color="#ffffff" />}
                       {fixStatus === 'fixed' && <Check size={24} color="#ffffff" />}
                       {fixStatus === 'error' && <AlertTriangle size={24} color="#ffffff" />}
                     </div>
                  </div>
                </div>
              </div>

              {/* ========== 8. GELİŞTİRİCİ ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionDev}</div>
                <div style={s.card}>
                  <div className="v2-dev-profile">
                    <img 
                      src="/docspi-logo.png"
                      alt="aydocs"
                      className="v2-avatar-img"
                    />
                    <div className="v2-dev-details">
                      <span className="v2-dev-name">aydocs</span>
                      <span className="v2-dev-role">Ana Yapımcı ve Geliştirici</span>
                      
                      <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Teşekkürler & Krediler:</span>
                        <span className="v2-dev-name" style={{ fontSize: '0.85rem', color: '#a78bfa' }}>shencim</span>
                        <span className="v2-dev-role" style={{ display: 'block', fontSize: '0.65rem' }}>Projenin ilk kodlarını yazan kişi</span>
                      </div>
                    </div>
                  </div>
                  <div className="v2-dev-actions">
                     <button className="v2-btn youtube" onClick={() => openUrl(URLS.discord)} style={s.button}>
                       <MessageCircle size={18} /> {t.devSubscribe}
                     </button>
                     <button className="v2-btn coffee" onClick={() => openUrl(URLS.github)} style={s.button}>
                       <Github size={18} /> {t.devSupport}
                     </button>
                  </div>
                </div>
              </div>

              {/* ========== 9. ÖNEMLİ BİLGİ ========== */}
              <div style={s.section}>
                <div style={s.sectionTitle}>{t.sectionNotice}</div>
                <div style={{ ...s.card, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={s.item}>
                     <div className="v2-icon" style={{ ...s.icon, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                       <AlertTriangle size={20} />
                     </div>
                     <div style={s.itemText}>
                       <h3 style={{ ...s.itemTitle, color: '#fca5a5' }}>{t.noticeTitle}</h3>
                       <p style={{ ...s.itemDesc, color: '#f87171', lineHeight: '1.4' }}>
                         {t.noticeDesc}
                       </p>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs / Bottom Nav */}
      <nav className="bottom-nav" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10, 10, 18, 0.95)' }}>
        <button className="nav-btn" onClick={() => setActiveTab('general')} style={{ color: activeTab === 'general' ? '#fff' : '' }}>
          <SettingsIcon size={22} strokeWidth={activeTab === 'general' ? 2.5 : 2} style={{ color: activeTab === 'general' ? '#a78bfa' : '' }} />
          <span>{t.tabGeneral || 'GENEL'}</span>
        </button>
        <div className="nav-divider" />
        <button className="nav-btn" onClick={() => setActiveTab('network')} style={{ color: activeTab === 'network' ? '#fff' : '' }}>
          <Globe size={22} strokeWidth={activeTab === 'network' ? 2.5 : 2} style={{ color: activeTab === 'network' ? '#a855f7' : '' }} />
          <span>{t.tabNetwork || 'AĞ'}</span>
        </button>
        <div className="nav-divider" />
        <button className="nav-btn" onClick={() => setActiveTab('notifications')} style={{ color: activeTab === 'notifications' ? '#fff' : '' }}>
          <Bell size={22} strokeWidth={activeTab === 'notifications' ? 2.5 : 2} style={{ color: activeTab === 'notifications' ? '#10b981' : '' }} />
          <span>{t.tabNotification || 'BİLDİRİM'}</span>
        </button>
        <div className="nav-divider" />
        <button className="nav-btn" onClick={() => setActiveTab('system')} style={{ color: activeTab === 'system' ? '#fff' : '' }}>
          <Shield size={22} strokeWidth={activeTab === 'system' ? 2.5 : 2} style={{ color: activeTab === 'system' ? '#eab308' : '' }} />
          <span>{t.tabSystem || 'SİSTEM'}</span>
        </button>
      </nav>
    </div>
  );
};

export default Settings;

// feat(notifications): add Linux notification support via notify-send

// fix(ui): prevent double-click on connect button

// refactor(state): simplify React state management with useReducer

// fix(firewall): handle Windows Firewall service not running

// docs(api): add OpenAPI specification for IPC commands

// fix(ui): handle window resize on DPI-scaled displays

// fix(security): prevent DNS rebinding attacks in PAC server

// feat(game): add EA and Origin launcher bypass

// feat(ui): add connection history with timestamps

// test(frontend): add snapshot tests for React components

// feat(isp): add Milenicom ISP profile

// feat(game): add Blizzard Battle.net bypass

// refactor(rust): reduce lib.rs from 2548 to 1960 lines

// feat(game): add Valorant Vanguard bypass

// Commit: feat: implement Settings page with theme support [132226]

// feat: implement Settings page with theme support [132604]
