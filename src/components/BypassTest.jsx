import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getTranslations } from '../i18n';

const BypassTest = ({ proxyPort, language = 'tr' }) => {
  const t = getTranslations(language);
  const [status, setStatus] = useState('idle'); // idle, testing, success, failed, timeout

  const runTest = async () => {
    if (!proxyPort) return;
    setStatus('testing');
    try {
      const result = await invoke('test_bypass_connection', { proxyPort });
      setStatus(result ? 'success' : 'failed');
    } catch (err) {
      console.error('Bypass test error:', err);
      setStatus('failed');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'testing': return 'text-purple-500';
      default: return 'text-zinc-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success': return t.bypassTestSuccessShort;
      case 'failed': return t.bypassTestFailedShort;
      case 'testing': return t.bypassTestTesting;
      default: return t.bypassTestBtn;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={runTest}
        disabled={status === 'testing' || !proxyPort}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2
          ${status === 'testing' ? 'bg-zinc-800 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700 active:scale-95'}`}
      >
        {status === 'testing' && (
          <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        )}
        <span className={getStatusColor()}>{getStatusText()}</span>
      </button>
      
      {status === 'success' && (
        <span className="text-xs text-green-500/80 animate-fade-in">{t.bypassTestSuccess}</span>
      )}
      {status === 'failed' && (
        <span className="text-xs text-red-500/80 animate-fade-in">{t.bypassTestFailed}</span>
      )}
    </div>
  );
};

export default BypassTest;

// Commit: feat: implement BypassTest component [132225]

// feat: implement BypassTest component [132603]
