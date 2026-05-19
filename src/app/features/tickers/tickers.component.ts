import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TickersService, Ticker } from './tickers.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tickers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="tickers-container animate-fadeInUp">
      <!-- HEADER -->
      <div class="tickers-header">
        <div>
          <h1 class="page-title">Market Tickers</h1>
          <p class="page-subtitle">High-performance scrolling through stock database using Angular CDK Virtualization</p>
        </div>
        
        <div class="search-box">
          <mat-icon class="search-icon">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search by symbol or company name..." 
            [formControl]="searchControl" 
            class="search-input"
          />
          @if (searchControl.value) {
            <button mat-icon-button class="clear-btn" (click)="searchControl.setValue('')">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>
      </div>

      <!-- STATS GRID -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap primary">
            <mat-icon>list</mat-icon>
          </div>
          <div class="stat-details">
            <span class="stat-val">{{ totalCount() | number }}</span>
            <span class="stat-lbl">Total Tickers Loaded</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-details">
            <span class="stat-val">{{ activeCount() | number }}</span>
            <span class="stat-lbl">Active Listings</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap warning">
            <mat-icon>filter_list</mat-icon>
          </div>
          <div class="stat-details">
            <span class="stat-val">{{ filteredCount() | number }}</span>
            <span class="stat-lbl">Matching Search</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap accent">
            <mat-icon>speed</mat-icon>
          </div>
          <div class="stat-details">
            <span class="stat-val">CDK Scroll</span>
            <span class="stat-lbl">60 FPS Virtualized</span>
          </div>
        </div>
      </div>

      <!-- VIEWPORT PORT -->
      <div class="viewport-wrapper">
        <div class="viewport-header">
          <div class="col-symbol">Symbol</div>
          <div class="col-company">Company Details</div>
          <div class="col-exchange">Exchange</div>
          <div class="col-cik">CIK & FIGI</div>
          <div class="col-status">Status</div>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Fetching ticker listings from reference API...</p>
          </div>
        } @else if (filteredTickers().length === 0) {
          <div class="empty-state">
            <mat-icon>sentiment_dissatisfied</mat-icon>
            <h3>No tickers found</h3>
            <p>Try searching for a different symbol or name</p>
          </div>
        } @else {
          <cdk-virtual-scroll-viewport itemSize="72" class="tickers-viewport">
            <div *cdkVirtualFor="let ticker of filteredTickers(); trackBy: trackByTicker" class="ticker-row">
              
              <!-- Symbol Column -->
              <div class="col-symbol">
                <span class="symbol-badge">{{ ticker.ticker }}</span>
              </div>

              <!-- Company Details Column -->
              <div class="col-company">
                <div class="ticker-name" [matTooltip]="ticker.name">{{ ticker.name }}</div>
                <div class="ticker-sub">
                  <span class="badge market">{{ ticker.market | uppercase }}</span>
                  <span class="badge currency">{{ ticker.currency_name | uppercase }}</span>
                  <span class="badge locale">{{ ticker.locale | uppercase }}</span>
                </div>
              </div>

              <!-- Exchange Column -->
              <div class="col-exchange">
                <span class="exchange-val">{{ ticker.primary_exchange }}</span>
              </div>

              <!-- CIK & FIGI Column -->
              <div class="col-cik">
                <div class="meta-text">CIK: {{ ticker.cik || 'N/A' }}</div>
                <div class="meta-text sub">FIGI: {{ ticker.composite_figi || 'N/A' }}</div>
              </div>

              <!-- Status Column -->
              <div class="col-status">
                <span class="status-pill" [class.active]="ticker.active">
                  <span class="status-dot"></span>
                  {{ ticker.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              
            </div>
          </cdk-virtual-scroll-viewport>
        }
      </div>
    </div>
  `,
  styles: [`
    .tickers-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - var(--app-header-height, 64px) - 40px);
      margin: -20px;
      padding: 24px;
      background: var(--app-background, #f8f9fa);
      gap: 20px;
      overflow: hidden;
    }
    :host-context(body.dark-theme) .tickers-container {
      background: #0f1115;
    }

    .tickers-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .page-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--app-text-primary);
    }
    .page-subtitle {
      font-size: 14px;
      color: var(--app-text-muted);
      margin: 0;
    }

    /* Search Box */
    .search-box {
      position: relative;
      width: 320px;
      display: flex;
      align-items: center;
      background: var(--app-surface-card, #fff);
      border: 1px solid var(--app-border, #e2e8f0);
      border-radius: 24px;
      padding: 2px 8px 2px 16px;
      box-shadow: var(--app-shadow-sm);
      transition: all 0.2s ease;
      &:focus-within {
        border-color: var(--app-primary);
        box-shadow: 0 0 0 3px rgba(var(--app-primary-rgb), 0.1);
        width: 380px;
      }
    }
    .search-icon {
      color: var(--app-text-muted);
      margin-right: 8px;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      height: 38px;
      width: 100%;
      font-size: 14px;
      color: var(--app-text-primary);
      &::placeholder {
        color: var(--app-text-muted);
      }
    }
    .clear-btn {
      color: var(--app-text-muted);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--app-surface-card, #fff);
      border: 1px solid var(--app-border, #e2e8f0);
      padding: 16px;
      border-radius: 12px;
      box-shadow: var(--app-shadow-sm);
    }
    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.primary { background: rgba(var(--app-primary-rgb, 59, 130, 246), 0.1); color: var(--app-primary); }
      &.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      &.accent { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
      mat-icon { font-size: 24px; }
    }
    .stat-details {
      display: flex;
      flex-direction: column;
    }
    .stat-val {
      font-size: 18px;
      font-weight: 700;
      color: var(--app-text-primary);
    }
    .stat-lbl {
      font-size: 12px;
      color: var(--app-text-muted);
    }

    /* Viewport wrapper */
    .viewport-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--app-surface-card, #fff);
      border: 1px solid var(--app-border, #e2e8f0);
      border-radius: 12px;
      box-shadow: var(--app-shadow-md);
      overflow: hidden;
    }

    .viewport-header {
      display: flex;
      padding: 14px 24px;
      background: var(--app-background-alt, #f8f9fa);
      border-bottom: 1px solid var(--app-border);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--app-text-secondary);
    }
    :host-context(body.dark-theme) .viewport-header {
      background: #141822;
    }

    /* Columns Widths */
    .col-symbol { width: 100px; flex-shrink: 0; }
    .col-company { flex: 2; min-width: 250px; }
    .col-exchange { flex: 1; min-width: 120px; }
    .col-cik { flex: 1.5; min-width: 150px; }
    .col-status { width: 110px; flex-shrink: 0; text-align: right; }

    /* Scrollbar Virtualization */
    .tickers-viewport {
      flex: 1;
      height: 100%;
      width: 100%;
    }

    .ticker-row {
      display: flex;
      align-items: center;
      height: 72px; /* must match itemSize exactly */
      padding: 0 24px;
      border-bottom: 1px solid var(--app-border, #e2e8f0);
      transition: background-color 0.15s ease;
      box-sizing: border-box;
      &:hover {
        background-color: var(--app-background-alt, #f8f9fa);
      }
    }
    :host-context(body.dark-theme) .ticker-row:hover {
      background-color: #141822;
    }

    /* Ticker Element Styles */
    .symbol-badge {
      display: inline-block;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      background: var(--app-primary);
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(var(--app-primary-rgb), 0.2);
    }
    
    .ticker-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--app-text-primary);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90%;
    }
    .ticker-sub {
      display: flex;
      gap: 6px;
    }
    .badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      &.market { background: #eff6ff; color: #2563eb; }
      &.currency { background: #ecfdf5; color: #059669; }
      &.locale { background: #fef3c7; color: #d97706; }
    }
    :host-context(body.dark-theme) .badge {
      &.market { background: rgba(37, 99, 235, 0.15); color: #60a5fa; }
      &.currency { background: rgba(5, 150, 105, 0.15); color: #34d399; }
      &.locale { background: rgba(217, 119, 6, 0.15); color: #fbbf24; }
    }

    .exchange-val {
      font-size: 14px;
      font-weight: 500;
      color: var(--app-text-secondary);
    }

    .meta-text {
      font-size: 12px;
      color: var(--app-text-secondary);
      &.sub {
        font-size: 11px;
        color: var(--app-text-muted);
        margin-top: 2px;
      }
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
      background: #f3f4f6;
      color: #4b5563;
      &.active {
        background: #ecfdf5;
        color: #059669;
        .status-dot { background: #10b981; }
      }
    }
    :host-context(body.dark-theme) .status-pill {
      background: rgba(255,255,255,0.05);
      color: #9ca3af;
      &.active {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #9ca3af;
    }

    /* States */
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 40px;
      color: var(--app-text-muted);
      text-align: center;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }
    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 4px;
      color: var(--app-text-primary);
    }
    .spinner {
      border: 3px solid rgba(var(--app-primary-rgb), 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: var(--app-primary);
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class TickersComponent implements OnInit {
  private tickersService = inject(TickersService);

  searchControl = new FormControl('');
  tickers = signal<Ticker[]>([]);
  searchFilter = signal<string>('');
  loading = signal<boolean>(true);

  totalCount = computed(() => this.tickers().length);
  activeCount = computed(() => this.tickers().filter(t => t.active).length);
  filteredCount = computed(() => this.filteredTickers().length);

  filteredTickers = computed(() => {
    const filter = this.searchFilter().trim().toLowerCase();
    const all = this.tickers();
    if (!filter) return all;

    return all.filter(t => 
      t.ticker.toLowerCase().includes(filter) || 
      t.name.toLowerCase().includes(filter) ||
      (t.cik && t.cik.includes(filter)) ||
      (t.primary_exchange && t.primary_exchange.toLowerCase().includes(filter))
    );
  });

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(val => {
        this.searchFilter.set(val || '');
      });

    this.fetchTickers();
  }

  fetchTickers() {
    this.loading.set(true);
    this.tickersService.getTickers().subscribe({
      next: (data) => {
        this.tickers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load tickers', err);
        this.loading.set(false);
      }
    });
  }

  trackByTicker(index: number, ticker: Ticker): string {
    return ticker.ticker;
  }
}
