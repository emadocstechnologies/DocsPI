import { describe, it, expect } from 'vitest';
import { DNS_MAP, DOH_MAP } from '../constants';
import { VALID_CHUNK_SIZES, VALID_DPI_METHODS, DEFAULT_CHUNKS } from '../profiles';

describe('constants.js', () => {
  describe('DNS_MAP', () => {
    it('should have cloudflare DNS', () => {
      expect(DNS_MAP.cloudflare).toBe('1.1.1.1');
    });

    it('should have google DNS', () => {
      expect(DNS_MAP.google).toBe('8.8.8.8');
    });

    it('should have system as null', () => {
      expect(DNS_MAP.system).toBeNull();
    });
  });

  describe('DOH_MAP', () => {
    it('should have cloudflare DoH', () => {
      expect(DOH_MAP.cloudflare).toBe('https://1.1.1.1/dns-query');
    });

    it('should have google DoH', () => {
      expect(DOH_MAP.google).toBe('https://8.8.8.8/dns-query');
    });
  });

  describe('VALID_CHUNK_SIZES', () => {
    it('should include common sizes', () => {
      expect(VALID_CHUNK_SIZES).toContain(1);
      expect(VALID_CHUNK_SIZES).toContain(2);
      expect(VALID_CHUNK_SIZES).toContain(4);
      expect(VALID_CHUNK_SIZES).toContain(8);
    });
  });

  describe('VALID_DPI_METHODS', () => {
    it('should have 3 methods', () => {
      expect(VALID_DPI_METHODS).toHaveLength(3);
    });

    it('should include 0, 1, 2', () => {
      expect(VALID_DPI_METHODS).toContain('0');
      expect(VALID_DPI_METHODS).toContain('1');
      expect(VALID_DPI_METHODS).toContain('2');
    });
  });

  describe('DEFAULT_CHUNKS', () => {
    it('should have defaults for all methods', () => {
      expect(DEFAULT_CHUNKS['0']).toBeDefined();
      expect(DEFAULT_CHUNKS['1']).toBeDefined();
      expect(DEFAULT_CHUNKS['2']).toBeDefined();
    });
  });
});



