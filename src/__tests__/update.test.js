import { describe, it, expect } from 'vitest';
import { isNewerVersion, parseChangelog, truncateChangelog } from '../lib/update';

describe('update.js', () => {
  describe('isNewerVersion', () => {
    it('should detect newer version', () => {
      expect(isNewerVersion('1.0.1', '1.0.0')).toBe(true);
      expect(isNewerVersion('2.0.0', '1.9.9')).toBe(true);
      expect(isNewerVersion('1.1.0', '1.0.9')).toBe(true);
    });

    it('should detect same version', () => {
      expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
    });

    it('should detect older version', () => {
      expect(isNewerVersion('1.0.0', '1.0.1')).toBe(false);
      expect(isNewerVersion('1.9.9', '2.0.0')).toBe(false);
    });

    it('should handle pre-release versions', () => {
      expect(isNewerVersion('1.0.0', '1.0.0-beta')).toBe(true);
      expect(isNewerVersion('1.0.0-beta', '1.0.0')).toBe(false);
      expect(isNewerVersion('1.0.0-beta.2', '1.0.0-beta.1')).toBe(true);
    });

    it('should handle null/undefined', () => {
      expect(isNewerVersion(null, '1.0.0')).toBe(false);
      expect(isNewerVersion(undefined, '1.0.0')).toBe(false);
    });
  });

  describe('parseChangelog', () => {
    it('should parse markdown changelog', () => {
      const md = `### Features
- Added new button
- Improved performance

### Bug Fixes
- Fixed crash on startup
- Fixed memory leak`;

      const sections = parseChangelog(md);
      expect(sections).toHaveLength(2);
      expect(sections[0].title).toBe('Features');
      expect(sections[0].items).toHaveLength(2);
      expect(sections[1].title).toBe('Bug Fixes');
      expect(sections[1].items).toHaveLength(2);
    });

    it('should handle empty input', () => {
      expect(parseChangelog(null)).toEqual([]);
      expect(parseChangelog('')).toEqual([]);
    });

    it('should handle plain text', () => {
      const sections = parseChangelog('Just some text');
      expect(sections).toHaveLength(1);
      expect(sections[0].title).toBe('Degisiklikler');
    });
  });

  describe('truncateChangelog', () => {
    it('should truncate items', () => {
      const sections = [{
        title: 'Features',
        items: ['a', 'b', 'c', 'd', 'e', 'f', 'g']
      }];
      const result = truncateChangelog(sections, 3);
      expect(result[0].items).toHaveLength(3);
      expect(result[0].hasMore).toBe(true);
    });

    it('should handle empty input', () => {
      expect(truncateChangelog(null)).toEqual([]);
      expect(truncateChangelog([])).toEqual([]);
    });
  });
});



