import { Component, inject, signal } from '@angular/core';
import { ThemeService, PRESET_THEMES, ThemeColor } from '../../core/services/theme.service';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiBadgeComponent } from '../../shared/ui/ui-badge/ui-badge.component';
import { UiAlertComponent } from '../../shared/ui/ui-alert/ui-alert.component';
import { UiDividerComponent } from '../../shared/ui/ui-divider/ui-divider.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    UiCardComponent, UiButtonComponent, UiBadgeComponent, UiAlertComponent, UiDividerComponent,
    MatIconModule, MatSlideToggleModule, MatTooltipModule, MatSnackBarModule
  ],
  template: `
    <div class="theme-page animate-fadeInUp">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-icon-wrap" aria-hidden="true">
            <mat-icon class="page-icon">palette</mat-icon>
          </div>
          <div>
            <h1 class="page-title">Colors &amp; Theme</h1>
            <p class="page-subtitle">Customize the look and feel of your application</p>
          </div>
        </div>
        <div class="page-header-actions">
          <ui-button variant="ghost" icon="refresh" (click)="resetTheme()">Reset</ui-button>
          <ui-button variant="primary" icon="check" (click)="saveTheme()">Apply Theme</ui-button>
        </div>
      </div>

      <div class="theme-layout">

        <!-- LEFT COLUMN -->
        <div class="theme-controls">

          <!-- Mode Toggle -->
          <ui-card title="Appearance Mode" subtitle="Light or Dark theme" headerIcon="brightness_6">
            <div class="mode-options">
              <button id="light-mode-btn"
                      class="mode-card"
                      [class.active]="!themeService.isDark()"
                      (click)="themeService.setDarkMode(false)"
                      aria-label="Light mode" aria-pressed="{{ !themeService.isDark() }}">
                <div class="mode-preview mode-preview--light" aria-hidden="true">
                  <div class="preview-header"></div>
                  <div class="preview-sidebar"></div>
                  <div class="preview-content">
                    <div class="preview-card"></div>
                    <div class="preview-card small"></div>
                  </div>
                </div>
                <span class="mode-label">
                  <mat-icon>light_mode</mat-icon> Light
                </span>
                @if (!themeService.isDark()) {
                  <span class="mode-check" aria-hidden="true">
                    <mat-icon>check_circle</mat-icon>
                  </span>
                }
              </button>

              <button id="dark-mode-btn"
                      class="mode-card"
                      [class.active]="themeService.isDark()"
                      (click)="themeService.setDarkMode(true)"
                      aria-label="Dark mode" [attr.aria-pressed]="themeService.isDark()">
                <div class="mode-preview mode-preview--dark" aria-hidden="true">
                  <div class="preview-header"></div>
                  <div class="preview-sidebar"></div>
                  <div class="preview-content">
                    <div class="preview-card"></div>
                    <div class="preview-card small"></div>
                  </div>
                </div>
                <span class="mode-label">
                  <mat-icon>dark_mode</mat-icon> Dark
                </span>
                @if (themeService.isDark()) {
                  <span class="mode-check" aria-hidden="true">
                    <mat-icon>check_circle</mat-icon>
                  </span>
                }
              </button>
            </div>
          </ui-card>

          <!-- Preset Themes -->
          <ui-card title="Preset Color Palettes" subtitle="Choose a pre-built color combination" headerIcon="color_lens">
            <div class="presets-grid" role="radiogroup" aria-label="Theme color presets">
              @for (preset of presets; track preset.name) {
                <button
                  [id]="'preset-' + preset.name"
                  class="preset-swatch"
                  [class.active]="themeService.activePreset() === preset.name"
                  (click)="applyPreset(preset)"
                  [attr.aria-label]="preset.label"
                  [attr.aria-pressed]="themeService.activePreset() === preset.name"
                  [matTooltip]="preset.label"
                  role="radio">
                  <div class="swatch-colors">
                    <span class="swatch-primary" [style.background]="preset.primary"></span>
                    <span class="swatch-accent"  [style.background]="preset.accent"></span>
                  </div>
                  <span class="swatch-name">{{ preset.label }}</span>
                  @if (themeService.activePreset() === preset.name) {
                    <mat-icon class="swatch-check" aria-hidden="true">check</mat-icon>
                  }
                </button>
              }
            </div>
          </ui-card>

          <!-- Custom Color Pickers -->
          <ui-card title="Custom Colors" subtitle="Pick any primary and accent color" headerIcon="colorize">
            <div class="custom-colors">
              <div class="color-picker-row">
                <label class="color-picker-label" for="primary-color-picker">
                  <span class="color-preview" [style.background]="customPrimary()" aria-hidden="true"></span>
                  <div>
                    <span class="label-title">Primary Color</span>
                    <span class="label-sub">Main brand color</span>
                  </div>
                </label>
                <div class="picker-wrap">
                  <input type="color"
                         id="primary-color-picker"
                         class="color-input"
                         [(ngModel)]="customPrimaryVal"
                         (input)="onCustomPrimaryChange($event)"
                         aria-label="Pick primary color" />
                  <span class="color-hex">{{ customPrimary() }}</span>
                </div>
              </div>

              <ui-divider />

              <div class="color-picker-row">
                <label class="color-picker-label" for="accent-color-picker">
                  <span class="color-preview" [style.background]="customAccent()" aria-hidden="true"></span>
                  <div>
                    <span class="label-title">Accent Color</span>
                    <span class="label-sub">Secondary action color</span>
                  </div>
                </label>
                <div class="picker-wrap">
                  <input type="color"
                         id="accent-color-picker"
                         class="color-input"
                         [(ngModel)]="customAccentVal"
                         (input)="onCustomAccentChange($event)"
                         aria-label="Pick accent color" />
                  <span class="color-hex">{{ customAccent() }}</span>
                </div>
              </div>

              <div style="margin-top:16px">
                <ui-button variant="accent" icon="auto_fix_high" [fullWidth]="true" (click)="applyCustomColors()">
                  Apply Custom Colors
                </ui-button>
              </div>
            </div>
          </ui-card>

        </div>

        <!-- RIGHT COLUMN: Live Preview -->
        <div class="theme-preview-col">
          <ui-card title="Live Preview" subtitle="See your theme in action" headerIcon="preview" variant="elevated">
            <div class="live-preview">

              <!-- Mini Header Preview -->
              <div class="preview-mini-header" [style.background]="themeService.theme().primary">
                <div class="pmh-brand" aria-hidden="true">
                  <span class="pmh-logo">◈</span>
                  <span class="pmh-name">SmarkUI</span>
                </div>
                <div class="pmh-actions" aria-hidden="true">
                  <span class="pmh-icon-btn"></span>
                  <span class="pmh-icon-btn"></span>
                  <span class="pmh-avatar"></span>
                </div>
              </div>

              <!-- Buttons preview -->
              <section class="preview-section" aria-label="Button preview">
                <h3 class="preview-section-title">Buttons</h3>
                <div class="preview-buttons">
                  <button class="pv-btn pv-btn--primary" [style.background]="themeService.theme().primary">Primary</button>
                  <button class="pv-btn pv-btn--accent"  [style.background]="themeService.theme().accent">Accent</button>
                  <button class="pv-btn pv-btn--outline" [style.border-color]="themeService.theme().primary" [style.color]="themeService.theme().primary">Outline</button>
                </div>
              </section>

              <ui-divider />

              <!-- Color Palette Swatches -->
              <section class="preview-section" aria-label="Color palette preview">
                <h3 class="preview-section-title">Color Palette</h3>
                <div class="palette-swatches">
                  <div class="palette-swatch" [style.background]="themeService.theme().primaryDark">
                    <span>Dark</span>
                  </div>
                  <div class="palette-swatch" [style.background]="themeService.theme().primary">
                    <span>Primary</span>
                  </div>
                  <div class="palette-swatch" [style.background]="themeService.theme().primaryLight">
                    <span>Light</span>
                  </div>
                  <div class="palette-swatch" [style.background]="themeService.theme().accent">
                    <span>Accent</span>
                  </div>
                  <div class="palette-swatch" [style.background]="themeService.theme().accentLight">
                    <span>Acc.Lt</span>
                  </div>
                </div>
              </section>

              <ui-divider />

              <!-- Cards preview -->
              <section class="preview-section" aria-label="Card preview">
                <h3 class="preview-section-title">Cards &amp; Badges</h3>
                <div class="pv-cards">
                  <div class="pv-mini-card">
                    <div class="pv-card-icon" [style.background]="themeService.theme().primary + '22'">
                      <mat-icon [style.color]="themeService.theme().primary">people</mat-icon>
                    </div>
                    <div class="pv-card-info">
                      <span class="pv-card-val">4,281</span>
                      <span class="pv-card-lbl">Users</span>
                    </div>
                    <span class="pv-tag" [style.background]="themeService.theme().primary + '20'" [style.color]="themeService.theme().primary">+12%</span>
                  </div>
                  <div class="pv-mini-card">
                    <div class="pv-card-icon" [style.background]="themeService.theme().accent + '22'">
                      <mat-icon [style.color]="themeService.theme().accent">payments</mat-icon>
                    </div>
                    <div class="pv-card-info">
                      <span class="pv-card-val">$9.4K</span>
                      <span class="pv-card-lbl">Revenue</span>
                    </div>
                    <span class="pv-tag" [style.background]="themeService.theme().accent + '20'" [style.color]="themeService.theme().accent">+8%</span>
                  </div>
                </div>
              </section>

              <!-- Theme info -->
              <div class="theme-info-row">
                <ui-badge color="primary">{{ themeService.activePreset() === 'custom' ? 'Custom' : 'Preset' }}</ui-badge>
                <span class="theme-info-label" style="color: var(--app-text-muted); font-size: 12px;">
                  {{ themeService.isDark() ? '🌙 Dark Mode' : '☀️ Light Mode' }}
                </span>
              </div>

            </div>
          </ui-card>

          <ui-alert type="success" title="Real-time Updates">
            Changes apply instantly across the entire application. Your preference is saved and restored on next visit.
          </ui-alert>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .theme-page { display: flex; flex-direction: column; gap: 20px; max-width: 1300px; }

    .page-header {
      display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    }
    .page-header-left { display: flex; align-items: center; gap: 14px; }
    .page-icon-wrap {
      width: 52px; height: 52px; border-radius: 14px;
      background: linear-gradient(135deg, var(--app-primary), var(--app-accent));
      display: flex; align-items: center; justify-content: center;
    }
    .page-icon { color: #fff; font-size: 26px; }
    .page-title { font-size: 26px; font-weight: 700; color: var(--app-text-primary); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
    .page-header-actions { display: flex; gap: 10px; }

    .theme-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
      align-items: start;
    }
    .theme-controls { display: flex; flex-direction: column; gap: 16px; }

    /* Mode Cards */
    .mode-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .mode-card {
      position: relative; border: 2px solid var(--app-border); border-radius: var(--app-border-radius);
      background: var(--app-bg); padding: 12px; cursor: pointer; text-align: left;
      transition: all var(--app-transition); overflow: hidden;
      &:hover { border-color: var(--app-primary); transform: translateY(-2px); }
      &.active { border-color: var(--app-primary); background: color-mix(in srgb, var(--app-primary) 5%, transparent); }
    }
    .mode-preview {
      width: 100%; height: 80px; border-radius: 8px; overflow: hidden; margin-bottom: 10px;
      display: grid; grid-template-rows: 20px 1fr; grid-template-columns: 40px 1fr;
      &--light { background: #f8f8fa; .preview-header { background: var(--app-primary); } .preview-sidebar { background: #fff; } .preview-content { background: #f0f0f5; } }
      &--dark  { background: #1a1a2e; .preview-header { background: #111122; } .preview-sidebar { background: #0d0d1a; } .preview-content { background: #12121e; } }
    }
    .preview-header { grid-column: 1 / -1; }
    .preview-sidebar { border-right: 1px solid rgba(255,255,255,0.1); }
    .preview-content { display: flex; flex-direction: column; gap: 4px; padding: 4px; }
    .preview-card {
      height: 20px; border-radius: 3px; background: rgba(255,255,255,0.6);
      &.small { height: 12px; width: 70%; }
    }
    .mode-label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--app-text-primary); mat-icon { font-size: 16px; } }
    .mode-check { position: absolute; top: 8px; right: 8px; color: var(--app-primary); mat-icon { font-size: 18px; } }

    /* Presets Grid */
    .presets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
    .preset-swatch {
      position: relative; border: 2px solid var(--app-border); border-radius: var(--app-border-radius-sm);
      background: var(--app-surface-card); padding: 10px 8px; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      transition: all var(--app-transition);
      &:hover { border-color: var(--app-primary); transform: translateY(-2px); box-shadow: var(--app-shadow-md); }
      &.active { border-color: var(--app-primary); }
    }
    .swatch-colors { display: flex; border-radius: 20px; overflow: hidden; height: 28px; width: 52px; }
    .swatch-primary, .swatch-accent { flex: 1; transition: background var(--app-transition); }
    .swatch-name { font-size: 11px; font-weight: 500; color: var(--app-text-secondary); text-align: center; line-height: 1.2; }
    .swatch-check { position: absolute; top: 4px; right: 4px; font-size: 14px; color: var(--app-primary); }

    /* Custom Colors */
    .custom-colors { display: flex; flex-direction: column; gap: 12px; }
    .color-picker-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .color-picker-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .color-preview { width: 36px; height: 36px; border-radius: 50%; border: 3px solid var(--app-border); flex-shrink: 0; transition: background var(--app-transition); }
    .label-title { display: block; font-size: 14px; font-weight: 500; color: var(--app-text-primary); }
    .label-sub   { display: block; font-size: 12px; color: var(--app-text-muted); }
    .picker-wrap { display: flex; align-items: center; gap: 8px; }
    .color-input { width: 44px; height: 44px; border: none; border-radius: var(--app-border-radius-sm); cursor: pointer; padding: 2px; background: var(--app-border); }
    .color-hex { font-size: 12px; color: var(--app-text-muted); font-family: monospace; min-width: 64px; }

    /* Live Preview */
    .live-preview { display: flex; flex-direction: column; gap: 16px; }
    .preview-mini-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; border-radius: var(--app-border-radius-sm); transition: background var(--app-transition);
    }
    .pmh-brand { display: flex; align-items: center; gap: 6px; }
    .pmh-logo { color: #fff; font-size: 14px; }
    .pmh-name { color: #fff; font-size: 13px; font-weight: 700; }
    .pmh-actions { display: flex; align-items: center; gap: 6px; }
    .pmh-icon-btn { width: 20px; height: 20px; background: rgba(255,255,255,0.25); border-radius: 50%; }
    .pmh-avatar { width: 22px; height: 22px; background: rgba(255,255,255,0.4); border-radius: 50%; }

    .preview-section-title { font-size: 12px; font-weight: 600; color: var(--app-text-muted); margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px; }

    .preview-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .pv-btn { padding: 7px 16px; border-radius: var(--app-border-radius-sm); font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all var(--app-transition);
      &--primary { color: #fff; }
      &--accent  { color: #fff; }
      &--outline { background: transparent; border: 1.5px solid; }
    }

    .palette-swatches { display: flex; border-radius: var(--app-border-radius-sm); overflow: hidden; height: 44px; }
    .palette-swatch { flex: 1; display: flex; align-items: flex-end; padding: 0 0 4px 4px; span { font-size: 9px; color: rgba(255,255,255,0.85); font-weight: 600; } }

    .pv-cards { display: flex; flex-direction: column; gap: 8px; }
    .pv-mini-card {
      display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--app-bg);
      border-radius: var(--app-border-radius-sm); border: 1px solid var(--app-border);
    }
    .pv-card-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; mat-icon { font-size: 18px; } }
    .pv-card-info { flex: 1; }
    .pv-card-val { display: block; font-size: 15px; font-weight: 700; color: var(--app-text-primary); }
    .pv-card-lbl { font-size: 11px; color: var(--app-text-muted); }
    .pv-tag { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 10px; }

    .theme-info-row { display: flex; align-items: center; justify-content: space-between; }

    @media (max-width: 1100px) { .theme-layout { grid-template-columns: 1fr; } }
    @media (max-width: 600px) {
      .mode-options { grid-template-columns: 1fr; }
      .page-header-actions { flex-direction: column; }
    }
  `]
})
export class ThemeSettingsComponent {
  themeService = inject(ThemeService);
  snackBar = inject(MatSnackBar);

  presets = PRESET_THEMES;

  customPrimaryVal = this.themeService.theme().primary;
  customAccentVal = this.themeService.theme().accent;
  customPrimary = signal(this.themeService.theme().primary);
  customAccent = signal(this.themeService.theme().accent);

  applyPreset(preset: ThemeColor): void {
    this.themeService.applyPreset(preset);
    this.customPrimary.set(preset.primary);
    this.customAccent.set(preset.accent);
    this.customPrimaryVal = preset.primary;
    this.customAccentVal = preset.accent;
  }

  onCustomPrimaryChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.customPrimary.set(val);
  }

  onCustomAccentChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.customAccent.set(val);
  }

  applyCustomColors(): void {
    this.themeService.applyCustomColors(this.customPrimary(), this.customAccent());
    this.snackBar.open('Custom theme applied!', 'OK', { duration: 2500 });
  }

  saveTheme(): void {
    this.snackBar.open('Theme saved successfully!', '✓', { duration: 2500, panelClass: 'snack-success' });
  }

  resetTheme(): void {
    this.themeService.applyPreset(PRESET_THEMES[0]);
    this.themeService.setDarkMode(false);
    this.customPrimary.set(PRESET_THEMES[0].primary);
    this.customAccent.set(PRESET_THEMES[0].accent);
    this.customPrimaryVal = PRESET_THEMES[0].primary;
    this.customAccentVal = PRESET_THEMES[0].accent;
    this.snackBar.open('Theme reset to default.', 'OK', { duration: 2000 });
  }
}
