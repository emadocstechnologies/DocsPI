import React from 'react';
import { getTranslations } from '../i18n';
import { useTheme } from '../context/ThemeContext';

const WelcomeScreen = ({ onFinish, language = 'tr' }) => {
  const t = getTranslations(language);
  const { theme } = useTheme();

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
      <div className="max-w-md w-full text-center space-y-8 animate-fade-up">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-600/20">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            {t.welcomeTitle}
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {t.welcomeDesc}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onFinish}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl shadow-purple-600/20"
          >
            {t.welcomeNext}
          </button>
          
          <p className="text-xs text-zinc-500">
            {t.welcomePrivacy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

// Commit: feat: add WelcomeScreen component [132225]

// feat: add WelcomeScreen component [132603]
