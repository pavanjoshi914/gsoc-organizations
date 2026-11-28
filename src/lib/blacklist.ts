import type { OrganizationSummary } from '../types.ts';

export const HIDDEN_ORGS_STORAGE_KEY = 'gsoc_hidden_orgs';

/**
 * Safely loads hidden organization IDs from localStorage.
 * Handles missing data, non-array types, and malformed strings safely.
 */
export const loadHiddenOrgIds = (): string[] => {
  try {
    const saved = localStorage.getItem(HIDDEN_ORGS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    // Ensure all entries are non-empty valid strings and deduplicate
    const sanitized = parsed.filter(
      (id): id is string => typeof id === 'string' && id.trim().length > 0
    );
    return Array.from(new Set(sanitized));
  } catch (error) {
    console.error('Failed to parse hidden organization IDs from localStorage:', error);
    return [];
  }
};

/**
 * Safely persists hidden organization IDs to localStorage.
 */
export const saveHiddenOrgIds = (ids: string[]): void => {
  try {
    const uniqueIds = Array.from(new Set(ids));
    localStorage.setItem(HIDDEN_ORGS_STORAGE_KEY, JSON.stringify(uniqueIds));
  } catch (error) {
    console.error('Failed to save hidden organization IDs to localStorage:', error);
  }
};

/**
 * Checks if a specific organization ID is hidden.
 */
export const isOrgHidden = (id: string, hiddenIds: string[]): boolean => {
  return hiddenIds.includes(id);
};

/**
 * Adds an organization ID to the hidden list without duplicates.
 */
export const hideOrgId = (id: string, currentIds: string[]): string[] => {
  if (!id || typeof id !== 'string') return currentIds;
  if (currentIds.includes(id)) return currentIds;
  return [...currentIds, id];
};

/**
 * Removes an organization ID from the hidden list.
 */
export const restoreOrgId = (id: string, currentIds: string[]): string[] => {
  return currentIds.filter((existingId) => existingId !== id);
};

/**
 * Filters out blacklisted organizations from a list of organizations.
 */
export const filterVisibleOrganizations = (
  organizations: OrganizationSummary[],
  hiddenIds: string[]
): OrganizationSummary[] => {
  if (!hiddenIds || hiddenIds.length === 0) return organizations;
  const hiddenSet = new Set(hiddenIds);
  return organizations.filter((org) => !hiddenSet.has(org.id));
};
