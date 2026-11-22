import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  HIDDEN_ORGS_STORAGE_KEY,
  loadHiddenOrgIds,
  saveHiddenOrgIds,
  isOrgHidden,
  hideOrgId,
  restoreOrgId,
  filterVisibleOrganizations,
} from '../src/lib/blacklist.ts';
import type { OrganizationSummary } from '../src/types.ts';

// Mock localStorage for Node environment testing
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Attach mock localStorage to global if not present
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as unknown as { localStorage: MockLocalStorage }).localStorage = new MockLocalStorage();
}

const createMockOrg = (id: string, name: string, category: string, years: string[], tech: string[]): OrganizationSummary => ({
  id,
  name,
  url: `https://${id}.org`,
  image_url: `https://${id}.org/logo.png`,
  image_background_color: '#ffffff',
  description: `${name} description`,
  category,
  topics: ['open-source'],
  technologies: tech,
  years,
  years_count: years.length,
  total_projects: years.length * 5,
  projects_by_year: {},
});

describe('Blacklist / Persistent Organization Hiding', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Storage persistence & safety (loadHiddenOrgIds & saveHiddenOrgIds)', () => {
    it('returns empty array when localStorage is empty', () => {
      const result = loadHiddenOrgIds();
      assert.deepStrictEqual(result, []);
    });

    it('correctly loads saved organization IDs', () => {
      localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, JSON.stringify(['org-1', 'org-2']));
      const result = loadHiddenOrgIds();
      assert.deepStrictEqual(result, ['org-1', 'org-2']);
    });

    it('deduplicates stored IDs on load', () => {
      localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, JSON.stringify(['org-1', 'org-1', 'org-2', 'org-2']));
      const result = loadHiddenOrgIds();
      assert.deepStrictEqual(result, ['org-1', 'org-2']);
    });

    it('handles malformed JSON gracefully without throwing', () => {
      localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, 'not-valid-json{{{');
      const result = loadHiddenOrgIds();
      assert.deepStrictEqual(result, []);
    });

    it('handles non-array stored data safely', () => {
      localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, JSON.stringify({ key: 'value' }));
      assert.deepStrictEqual(loadHiddenOrgIds(), []);

      localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, JSON.stringify(12345));
      assert.deepStrictEqual(loadHiddenOrgIds(), []);

      localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, JSON.stringify(true));
      assert.deepStrictEqual(loadHiddenOrgIds(), []);
    });

    it('filters out non-string, empty, or whitespace-only items', () => {
      localStorage.setItem(
        HIDDEN_ORGS_STORAGE_KEY,
        JSON.stringify(['org-1', 42, null, undefined, '', '   ', 'org-2'])
      );
      const result = loadHiddenOrgIds();
      assert.deepStrictEqual(result, ['org-1', 'org-2']);
    });

    it('saves organization IDs and removes duplicates', () => {
      saveHiddenOrgIds(['org-1', 'org-2', 'org-1']);
      const stored = localStorage.getItem(HIDDEN_ORGS_STORAGE_KEY);
      assert.ok(stored);
      assert.deepStrictEqual(JSON.parse(stored), ['org-1', 'org-2']);
    });
  });

  describe('Blacklist state operations (hideOrgId, restoreOrgId, isOrgHidden)', () => {
    it('isOrgHidden accurately identifies hidden IDs', () => {
      const hidden = ['apache', 'mozilla'];
      assert.strictEqual(isOrgHidden('apache', hidden), true);
      assert.strictEqual(isOrgHidden('mozilla', hidden), true);
      assert.strictEqual(isOrgHidden('linux', hidden), false);
    });

    it('hideOrgId appends a new ID without mutating original array', () => {
      const original = ['apache'];
      const updated = hideOrgId('mozilla', original);
      assert.deepStrictEqual(updated, ['apache', 'mozilla']);
      assert.deepStrictEqual(original, ['apache']); // immutable
    });

    it('hideOrgId avoids adding duplicates', () => {
      const original = ['apache', 'mozilla'];
      const updated = hideOrgId('apache', original);
      assert.deepStrictEqual(updated, ['apache', 'mozilla']);
    });

    it('hideOrgId ignores invalid or empty IDs', () => {
      const original = ['apache'];
      assert.deepStrictEqual(hideOrgId('', original), ['apache']);
      assert.deepStrictEqual(hideOrgId(null as unknown as string, original), ['apache']);
    });

    it('restoreOrgId removes a single organization from blacklist', () => {
      const original = ['apache', 'mozilla', 'blender'];
      const updated = restoreOrgId('mozilla', original);
      assert.deepStrictEqual(updated, ['apache', 'blender']);
      assert.deepStrictEqual(original, ['apache', 'mozilla', 'blender']); // immutable
    });

    it('restoreOrgId handles non-existent ID gracefully', () => {
      const original = ['apache'];
      const updated = restoreOrgId('non-existent', original);
      assert.deepStrictEqual(updated, ['apache']);
    });
  });

  describe('Discovery & filtering integration (filterVisibleOrganizations)', () => {
    const mockOrgs: OrganizationSummary[] = [
      createMockOrg('apache', 'Apache Software Foundation', 'Web', ['2024', '2025', '2026'], ['Java', 'Python']),
      createMockOrg('mozilla', 'Mozilla', 'Web', ['2023', '2024', '2025'], ['Rust', 'JavaScript']),
      createMockOrg('blender', 'Blender Foundation', 'Graphics', ['2025', '2026'], ['C++', 'Python']),
      createMockOrg('wikimedia', 'Wikimedia Foundation', 'Web', ['2024', '2026'], ['PHP', 'Python']),
    ];

    it('returns all organizations when hidden list is empty', () => {
      const visible = filterVisibleOrganizations(mockOrgs, []);
      assert.strictEqual(visible.length, mockOrgs.length);
    });

    it('immediately excludes a hidden organization', () => {
      const hidden = ['mozilla'];
      const visible = filterVisibleOrganizations(mockOrgs, hidden);
      assert.strictEqual(visible.length, 3);
      assert.strictEqual(visible.some((o) => o.id === 'mozilla'), false);
      assert.strictEqual(visible.some((o) => o.id === 'apache'), true);
      assert.strictEqual(visible.some((o) => o.id === 'blender'), true);
      assert.strictEqual(visible.some((o) => o.id === 'wikimedia'), true);
    });

    it('excludes multiple hidden organizations', () => {
      const hidden = ['apache', 'blender'];
      const visible = filterVisibleOrganizations(mockOrgs, hidden);
      assert.strictEqual(visible.length, 2);
      assert.strictEqual(visible.some((o) => o.id === 'apache'), false);
      assert.strictEqual(visible.some((o) => o.id === 'blender'), false);
      assert.strictEqual(visible.some((o) => o.id === 'mozilla'), true);
      assert.strictEqual(visible.some((o) => o.id === 'wikimedia'), true);
    });

    it('does not mutate the source organizations dataset', () => {
      const originalCopy = [...mockOrgs];
      filterVisibleOrganizations(mockOrgs, ['apache', 'mozilla']);
      assert.strictEqual(mockOrgs.length, originalCopy.length);
      assert.strictEqual(mockOrgs[0].id, 'apache');
    });

    it('restoring an organization makes it visible again in discovery', () => {
      let hidden = ['apache', 'mozilla'];
      let visible = filterVisibleOrganizations(mockOrgs, hidden);
      assert.strictEqual(visible.some((o) => o.id === 'apache'), false);

      // Restore apache
      hidden = restoreOrgId('apache', hidden);
      visible = filterVisibleOrganizations(mockOrgs, hidden);
      assert.strictEqual(visible.some((o) => o.id === 'apache'), true);
      assert.strictEqual(visible.some((o) => o.id === 'mozilla'), false);
      assert.strictEqual(visible.length, 3);
    });

    it('restoring all organizations restores full discovery count', () => {
      let hidden = ['apache', 'mozilla', 'blender', 'wikimedia'];
      let visible = filterVisibleOrganizations(mockOrgs, hidden);
      assert.strictEqual(visible.length, 0);

      // Restore all
      hidden = [];
      visible = filterVisibleOrganizations(mockOrgs, hidden);
      assert.strictEqual(visible.length, 4);
    });

    it('hidden organization is excluded from search results even when text matches', () => {
      const hidden = ['mozilla'];
      const query = 'mozilla';
      const visible = filterVisibleOrganizations(mockOrgs, hidden).filter(
        (o) => o.name.toLowerCase().includes(query) || o.technologies.some((t) => t.toLowerCase().includes(query))
      );
      assert.strictEqual(visible.length, 0);
    });

    it('hidden organization remains excluded when filtering by category or year', () => {
      const hidden = ['apache']; // Apache is in 'Web' category and has '2026'

      // Filter by category 'Web'
      const webOrgs = filterVisibleOrganizations(mockOrgs, hidden).filter((o) => o.category === 'Web');
      assert.strictEqual(webOrgs.some((o) => o.id === 'apache'), false);
      assert.strictEqual(webOrgs.length, 2); // mozilla and wikimedia

      // Filter by year '2026'
      const active2026 = filterVisibleOrganizations(mockOrgs, hidden).filter((o) => o.years.includes('2026'));
      assert.strictEqual(active2026.some((o) => o.id === 'apache'), false);
      assert.strictEqual(active2026.length, 2); // blender and wikimedia
    });
  });
});
