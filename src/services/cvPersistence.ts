import type { CV } from '@/types/cv';

const CV_DRAFT_KEY = 'cv_draft';

export interface CVDraft {
  cvId: string;
  data: Partial<CV>;
  lastUpdated: string;
}

/**
 * Save CV draft data to localStorage
 */
export const saveCVDraft = (cvId: string, data: Partial<CV>): void => {
  if (typeof window === 'undefined') return;

  const draft: CVDraft = {
    cvId,
    data,
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(CV_DRAFT_KEY, JSON.stringify(draft));
};

/**
 * Get CV draft data from localStorage
 * Returns null if no draft exists or if draft is for a different CV
 */
export const getCVDraft = (cvId: string): Partial<CV> | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CV_DRAFT_KEY);
    if (!stored) return null;

    const draft: CVDraft = JSON.parse(stored);

    // Only return if draft is for the same CV
    if (draft.cvId !== cvId) return null;

    return draft.data;
  } catch {
    return null;
  }
};

/**
 * Update specific section of CV draft
 */
export const updateCVDraftSection = <K extends keyof CV>(
  cvId: string,
  section: K,
  data: CV[K]
): void => {
  if (typeof window === 'undefined') return;

  const existing = getCVDraft(cvId) || {};
  saveCVDraft(cvId, { ...existing, [section]: data });
};

/**
 * Clear CV draft from localStorage
 */
export const clearCVDraft = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CV_DRAFT_KEY);
};

/**
 * Check if there's an existing draft for a CV
 */
export const hasCVDraft = (cvId: string): boolean => {
  return getCVDraft(cvId) !== null;
};
