import { describe, it, expect } from 'vitest';
import { getTranslations, SUPPORTED_LANGUAGES, getLanguageMeta } from '../i18n';

describe('i18n.js', () => {
  describe('getTranslations', () => {
    it('should return Turkish translations by default', () => {
      const t = getTranslations('tr');
      expect(t.appName).toBe('DOCSPI');
      expect(t.statusActive).toBe('AKTİF');
    });

    it('should return English translations', () => {
      const t = getTranslations('en');
      expect(t.appName).toBe('DOCSPI');
      expect(t.statusActive).toBe('ACTIVE');
    });

    it('should fallback to English for unknown language', () => {
      const t = getTranslations('unknown');
      expect(t.appName).toBe('DOCSPI');
      expect(t.statusActive).toBe('ACTIVE');
    });

    it('should have all keys in both languages', () => {
      const tr = getTranslations('tr');
      const en = getTranslations('en');
      const trKeys = Object.keys(tr);
      const enKeys = Object.keys(en);
      expect(trKeys.length).toBe(enKeys.length);
    });
  });

  describe('SUPPORTED_LANGUAGES', () => {
    it('should have English as first language', () => {
      expect(SUPPORTED_LANGUAGES[0].code).toBe('en');
    });

    it('should have Turkish', () => {
      const tr = SUPPORTED_LANGUAGES.find(l => l.code === 'tr');
      expect(tr).toBeDefined();
      expect(tr.dir).toBe('ltr');
    });

    it('should have Arabic with RTL', () => {
      const ar = SUPPORTED_LANGUAGES.find(l => l.code === 'ar');
      expect(ar).toBeDefined();
      expect(ar.dir).toBe('rtl');
    });
  });

  describe('getLanguageMeta', () => {
    it('should return RTL for Arabic', () => {
      const meta = getLanguageMeta('ar');
      expect(meta.rtl).toBe(true);
    });

    it('should return LTR for English', () => {
      const meta = getLanguageMeta('en');
      expect(meta.rtl).toBe(false);
    });

    it('should return LTR for unknown language', () => {
      const meta = getLanguageMeta('unknown');
      expect(meta.rtl).toBe(false);
    });
  });
});

// Commit: feat: implement unit tests for i18n.js [132228]

// feat: implement unit tests for i18n.js [132605]
