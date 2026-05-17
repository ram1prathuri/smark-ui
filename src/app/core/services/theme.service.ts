import { Injectable, signal, effect } from '@angular/core';

export interface ThemeColor {
  name: string;
  label: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
}

export interface AppTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryContrast: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  accentContrast: string;
  isDark: boolean;
}

export const PRESET_THEMES: ThemeColor[] = [
  {
    name: 'indigo',
    label: 'Indigo Violet',
    primary: '#5C6BC0',
    primaryLight: '#8e99f3',
    primaryDark: '#26418f',
    accent: '#7E57C2',
    accentLight: '#b085f5',
    accentDark: '#4d2c91',
  },
  {
    name: 'ocean',
    label: 'Ocean Blue',
    primary: '#0288D1',
    primaryLight: '#5eb8ff',
    primaryDark: '#005b9f',
    accent: '#00ACC1',
    accentLight: '#5ddef4',
    accentDark: '#007c91',
  },
  {
    name: 'emerald',
    label: 'Emerald Green',
    primary: '#00897B',
    primaryLight: '#4ebaaa',
    primaryDark: '#005b4f',
    accent: '#43A047',
    accentLight: '#76d275',
    accentDark: '#00701a',
  },
  {
    name: 'rose',
    label: 'Rose Pink',
    primary: '#D81B60',
    primaryLight: '#ff5c8d',
    primaryDark: '#a00037',
    accent: '#E91E63',
    accentLight: '#ff6090',
    accentDark: '#b0003a',
  },
  {
    name: 'amber',
    label: 'Amber Orange',
    primary: '#F57C00',
    primaryLight: '#ffad42',
    primaryDark: '#bb4d00',
    accent: '#FF6F00',
    accentLight: '#ffa040',
    accentDark: '#c43e00',
  },
  {
    name: 'teal',
    label: 'Deep Teal',
    primary: '#00695C',
    primaryLight: '#439889',
    primaryDark: '#003d33',
    accent: '#26A69A',
    accentLight: '#64d8cb',
    accentDark: '#00766a',
  },
  {
    name: 'purple',
    label: 'Deep Purple',
    primary: '#6A1B9A',
    primaryLight: '#9c4dcc',
    primaryDark: '#38006b',
    accent: '#AB47BC',
    accentLight: '#df78ef',
    accentDark: '#790e8b',
  },
  {
    name: 'slate',
    label: 'Slate Gray',
    primary: '#455A64',
    primaryLight: '#718792',
    primaryDark: '#1c313a',
    accent: '#607D8B',
    accentLight: '#8eacbb',
    accentDark: '#34515e',
  },
];

const STORAGE_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Current theme state as a signal */
  readonly theme = signal<AppTheme>(this._loadTheme());

  /** Current dark mode state */
  readonly isDark = signal<boolean>(this._loadTheme().isDark);

  /** Active preset name */
  readonly activePreset = signal<string>('indigo');

  constructor() {
    // Apply theme whenever the signal changes
    effect(() => {
      this._applyTheme(this.theme());
    });
  }

  /** Apply a preset theme by name */
  applyPreset(preset: ThemeColor): void {
    this.activePreset.set(preset.name);
    this.updateTheme({
      primary: preset.primary,
      primaryLight: preset.primaryLight,
      primaryDark: preset.primaryDark,
      primaryContrast: '#ffffff',
      accent: preset.accent,
      accentLight: preset.accentLight,
      accentDark: preset.accentDark,
      accentContrast: '#ffffff',
      isDark: this.isDark(),
    });
  }

  /** Apply a fully custom primary + accent color */
  applyCustomColors(primary: string, accent: string): void {
    this.activePreset.set('custom');
    this.updateTheme({
      primary,
      primaryLight: this._lighten(primary, 0.3),
      primaryDark: this._darken(primary, 0.2),
      primaryContrast: this._getContrast(primary),
      accent,
      accentLight: this._lighten(accent, 0.3),
      accentDark: this._darken(accent, 0.2),
      accentContrast: this._getContrast(accent),
      isDark: this.isDark(),
    });
  }

  /** Toggle dark / light mode */
  toggleDarkMode(): void {
    const dark = !this.isDark();
    this.isDark.set(dark);
    this.theme.update((t) => ({ ...t, isDark: dark }));
  }

  /** Set dark mode explicitly */
  setDarkMode(dark: boolean): void {
    this.isDark.set(dark);
    this.theme.update((t) => ({ ...t, isDark: dark }));
  }

  /** Update the theme with partial overrides */
  updateTheme(partial: AppTheme): void {
    this.theme.set(partial);
    this._saveTheme(partial);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private _applyTheme(theme: AppTheme): void {
    const root = document.documentElement;
    root.style.setProperty('--app-primary', theme.primary);
    root.style.setProperty('--app-primary-light', theme.primaryLight);
    root.style.setProperty('--app-primary-dark', theme.primaryDark);
    root.style.setProperty('--app-primary-contrast', theme.primaryContrast);
    root.style.setProperty('--app-accent', theme.accent);
    root.style.setProperty('--app-accent-light', theme.accentLight);
    root.style.setProperty('--app-accent-dark', theme.accentDark);
    root.style.setProperty('--app-accent-contrast', theme.accentContrast);

    const body = document.body;
    if (theme.isDark) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  private _saveTheme(theme: AppTheme): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {}
  }

  private _loadTheme(): AppTheme {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AppTheme;
    } catch {}
    return {
      primary: '#5C6BC0',
      primaryLight: '#8e99f3',
      primaryDark: '#26418f',
      primaryContrast: '#ffffff',
      accent: '#7E57C2',
      accentLight: '#b085f5',
      accentDark: '#4d2c91',
      accentContrast: '#ffffff',
      isDark: false,
    };
  }

  /** Simple hex lighten using interpolation */
  private _lighten(hex: string, amount: number): string {
    return this._interpolateHex(hex, '#ffffff', amount);
  }

  /** Simple hex darken using interpolation */
  private _darken(hex: string, amount: number): string {
    return this._interpolateHex(hex, '#000000', amount);
  }

  private _interpolateHex(hex: string, target: string, amount: number): string {
    const from = this._hexToRgb(hex);
    const to = this._hexToRgb(target);
    if (!from || !to) return hex;
    const r = Math.round(from.r + (to.r - from.r) * amount);
    const g = Math.round(from.g + (to.g - from.g) * amount);
    const b = Math.round(from.b + (to.b - from.b) * amount);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private _hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /** Get white or black contrast color */
  private _getContrast(hex: string): string {
    const rgb = this._hexToRgb(hex);
    if (!rgb) return '#ffffff';
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
  }
}
