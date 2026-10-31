import type { CampusNotice } from '../types/index.ts';
import { INITIAL_DEMO_NOTICES } from '../data/sampleNotices.ts';

const STORAGE_KEYS = {
  NOTICES: 'campus_pulse_notices_v1',
  THEME: 'campus_pulse_theme_v1',
  LANG: 'campus_pulse_lang_v1',
  GEMINI_API_KEY: 'campus_pulse_gemini_key_v1',
  USER_PREFS: 'campus_pulse_prefs_v1'
};

export interface UserPreferences {
  studentName?: string;
  department?: string;
  year?: string;
}

export function loadNoticesFromStorage(): CampusNotice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!raw) {
      // First time user: initialize with demo data
      saveNoticesToStorage(INITIAL_DEMO_NOTICES);
      return INITIAL_DEMO_NOTICES;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid notices format in localStorage, resetting to demo data.');
      saveNoticesToStorage(INITIAL_DEMO_NOTICES);
      return INITIAL_DEMO_NOTICES;
    }

    // Validate that each item has required properties
    return parsed.filter((item): item is CampusNotice => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.category === 'string'
      );
    });
  } catch (error) {
    console.error('Failed to load notices from storage:', error);
    return INITIAL_DEMO_NOTICES;
  }
}

export function saveNoticesToStorage(notices: CampusNotice[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    return true;
  } catch (error) {
    console.error('Failed to save notices to storage:', error);
    return false;
  }
}

export function resetDemoDataInStorage(): CampusNotice[] {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_DEMO_NOTICES));
    return INITIAL_DEMO_NOTICES;
  } catch (error) {
    console.error('Failed to reset demo data:', error);
    return INITIAL_DEMO_NOTICES;
  }
}

export function clearAllNoticesFromStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify([]));
  } catch (error) {
    console.error('Failed to clear notices:', error);
  }
}

export function loadApiKeyFromStorage(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  } catch {
    return '';
  }
}

export function saveApiKeyToStorage(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  } catch (error) {
    console.error('Failed to save API key:', error);
  }
}

export function loadThemeFromStorage(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default dark midnight theme
  } catch {
    return 'dark';
  }
}

export function saveThemeToStorage(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

export function loadLanguageFromStorage(): 'en' | 'hi' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    if (saved === 'hi' || saved === 'en') return saved;
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguageToStorage(lang: 'en' | 'hi'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
}

export function exportNoticesAsJSON(notices: CampusNotice[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notices, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `campus_pulse_notices_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
