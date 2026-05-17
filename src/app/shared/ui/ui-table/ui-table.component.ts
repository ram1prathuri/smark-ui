import {
  Component, input, output, signal, computed,
  OnChanges, SimpleChanges, ViewChild, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SelectionModel } from '@angular/cdk/collections';

export interface UiTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** custom cell render fn: receives row, returns string/html-safe value */
  render?: (row: any) => string;
  /** badge config: maps cell value → badge color */
  badge?: Record<string, 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'>;
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatCheckboxModule, MatIconModule, MatTooltipModule,
    MatMenuModule, MatProgressBarModule,
  ],
  template: `
    <div class="ui-table-wrap">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          @if (title()) {
            <h2 class="table-title">{{ title() }}</h2>
          }
          @if (selectable() && selection.hasValue()) {
            <span class="selection-count">
              {{ selection.selected.length }} selected
            </span>
          }
        </div>
        <div class="toolbar-right">
          @if (searchable()) {
            <div class="search-box" role="search">
              <mat-icon class="search-ico" aria-hidden="true">search</mat-icon>
              <input class="search-field"
                     id="ui-table-search"
                     type="search"
                     [(ngModel)]="searchValue"
                     (ngModelChange)="onSearch($event)"
                     placeholder="Search..."
                     aria-label="Search table" />
              @if (searchValue) {
                <button class="search-clear" (click)="clearSearch()" aria-label="Clear search">
                  <mat-icon>close</mat-icon>
                </button>
              }
            </div>
          }
          @if (selectable() && selection.hasValue()) {
            <button class="toolbar-icon-btn danger"
                    id="delete-selected-btn"
                    (click)="deleteSelected.emit(selection.selected)"
                    matTooltip="Delete selected">
              <mat-icon>delete_outline</mat-icon>
            </button>
          }
          @if (exportable()) {
            <button class="toolbar-icon-btn"
                    id="export-table-btn"
                    (click)="onExport()"
                    matTooltip="Export CSV">
              <mat-icon>download</mat-icon>
            </button>
          }
        </div>
      </div>

      <!-- Loading bar -->
      @if (loading()) {
        <mat-progress-bar mode="indeterminate" class="table-progress" />
      }

      <!-- Scrollable table -->
      <div class="table-scroll" [class.table--loading]="loading()">
        <table mat-table
               [dataSource]="dataSource"
               matSort
               (matSortChange)="onSortChange($event)"
               class="ui-mat-table"
               [attr.aria-label]="title() || 'Data table'">

          <!-- Checkbox column -->
          @if (selectable()) {
            <ng-container matColumnDef="__select">
              <th mat-header-cell *matHeaderCellDef class="col-check">
                <mat-checkbox
                  id="select-all-checkbox"
                  [checked]="isAllSelected()"
                  [indeterminate]="selection.hasValue() && !isAllSelected()"
                  (change)="toggleAllRows()"
                  aria-label="Select all rows" />
              </th>
              <td mat-cell *matCellDef="let row" class="col-check">
                <mat-checkbox
                  [checked]="selection.isSelected(row)"
                  (change)="selection.toggle(row)"
                  [attr.aria-label]="'Select row'" />
              </td>
            </ng-container>
          }

          <!-- Dynamic columns -->
          @for (col of columns(); track col.key) {
            <ng-container [matColumnDef]="col.key">
              <th mat-header-cell
                  *matHeaderCellDef
                  [mat-sort-header]="col.sortable ? col.key : ''"
                  [disabled]="!col.sortable"
                  [style.width]="col.width || 'auto'"
                  [style.text-align]="col.align || 'left'"
                  class="ui-th">
                {{ col.label }}
              </th>
              <td mat-cell
                  *matCellDef="let row"
                  [style.text-align]="col.align || 'left'"
                  class="ui-td">
                @if (col.badge && col.badge[row[col.key]]) {
                  <span class="cell-badge" [class]="'cell-badge--' + col.badge[row[col.key]]">
                    {{ col.render ? col.render(row) : row[col.key] }}
                  </span>
                } @else if (col.render) {
                  <span [innerHTML]="col.render(row)"></span>
                } @else {
                  {{ row[col.key] }}
                }
              </td>
            </ng-container>
          }

          <!-- Actions column -->
          @if (hasActions()) {
            <ng-container matColumnDef="__actions">
              <th mat-header-cell *matHeaderCellDef class="col-actions">Actions</th>
              <td mat-cell *matCellDef="let row" class="col-actions">
                <button class="row-action-btn"
                        [matMenuTriggerFor]="rowMenu"
                        [matMenuTriggerData]="{ row: row }"
                        [attr.aria-label]="'Row actions for row'"
                        matTooltip="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="displayedColumns(); sticky: stickyHeader()"></tr>
          <tr mat-row
              *matRowDef="let row; columns: displayedColumns();"
              class="ui-row"
              [class.ui-row--selected]="selection.isSelected(row)"
              (click)="onRowClick(row)">
          </tr>

          <!-- No data row -->
          <tr class="mat-row" *matNoDataRow>
            <td class="no-data-cell" [attr.colspan]="displayedColumns().length">
              <div class="empty-state">
                <mat-icon class="empty-icon" aria-hidden="true">inbox</mat-icon>
                <span>{{ emptyMessage() }}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Paginator -->
      @if (paginated()) {
        <mat-paginator
          #paginator
          [pageSize]="pageSize()"
          [pageSizeOptions]="pageSizeOptions()"
          [showFirstLastButtons]="true"
          class="ui-paginator"
          aria-label="Table pagination" />
      }
    </div>

    <!-- Row context menu -->
    <mat-menu #rowMenu="matMenu">
      <ng-template matMenuContent let-row="row">
        <button mat-menu-item id="row-view-btn" (click)="rowView.emit(row)">
          <mat-icon>visibility</mat-icon> View
        </button>
        <button mat-menu-item id="row-edit-btn" (click)="rowEdit.emit(row)">
          <mat-icon>edit</mat-icon> Edit
        </button>
        <button mat-menu-item id="row-delete-btn" class="danger-item" (click)="rowDelete.emit(row)">
          <mat-icon>delete_outline</mat-icon> Delete
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .ui-table-wrap {
      border-radius: var(--app-border-radius);
      background: var(--app-surface-card);
      border: 1px solid var(--app-border);
      overflow: hidden;
      box-shadow: var(--app-shadow-sm);
    }

    /* ── Toolbar ── */
    .table-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; gap: 12px; border-bottom: 1px solid var(--app-border);
      flex-wrap: wrap;
    }
    .toolbar-left { display: flex; align-items: center; gap: 12px; }
    .toolbar-right { display: flex; align-items: center; gap: 8px; }
    .table-title { font-size: 15px; font-weight: 700; color: var(--app-text-primary); margin: 0; }
    .selection-count {
      font-size: 13px; font-weight: 500; color: var(--app-primary);
      background: color-mix(in srgb, var(--app-primary) 10%, transparent);
      padding: 3px 10px; border-radius: 20px;
    }

    /* Search */
    .search-box {
      display: flex; align-items: center; gap: 4px;
      background: var(--app-bg); border: 1px solid var(--app-border);
      border-radius: 8px; padding: 0 8px; height: 36px;
      transition: border-color var(--app-transition);
      &:focus-within { border-color: var(--app-primary); }
    }
    .search-ico { font-size: 18px; color: var(--app-text-muted); }
    .search-field {
      border: none; background: none; outline: none;
      font-size: 13px; color: var(--app-text-primary); width: 180px;
      font-family: 'Inter', sans-serif;
      &::placeholder { color: var(--app-text-muted); }
    }
    .search-clear {
      display: flex; align-items: center; border: none; background: none;
      cursor: pointer; color: var(--app-text-muted); padding: 0;
      mat-icon { font-size: 16px; }
    }

    /* Toolbar icon buttons */
    .toolbar-icon-btn {
      width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--app-border);
      background: var(--app-bg); display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--app-text-secondary); transition: all var(--app-transition);
      mat-icon { font-size: 18px; }
      &:hover { background: var(--app-primary); color: #fff; border-color: var(--app-primary); }
      &.danger:hover { background: #ef4444; border-color: #ef4444; color: #fff; }
    }

    /* ── Progress bar ── */
    .table-progress { height: 3px !important; }

    /* ── Table ── */
    .table-scroll {
      overflow-x: auto;
      transition: opacity var(--app-transition);
      &.table--loading { opacity: 0.5; pointer-events: none; }
    }

    .ui-mat-table {
      width: 100%;
      border-collapse: collapse;
      background: transparent !important;
    }

    .ui-th {
      font-size: 12px !important;
      font-weight: 700 !important;
      color: var(--app-text-muted) !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: var(--app-bg) !important;
      border-bottom: 1px solid var(--app-border) !important;
      padding: 10px 16px !important;
      white-space: nowrap;
    }

    .ui-td {
      font-size: 13px;
      color: var(--app-text-primary);
      padding: 12px 16px !important;
      border-bottom: 1px solid var(--app-border) !important;
      vertical-align: middle;
    }

    .ui-row {
      transition: background var(--app-transition);
      cursor: pointer;
      &:hover { background: color-mix(in srgb, var(--app-primary) 4%, transparent); }
      &--selected { background: color-mix(in srgb, var(--app-primary) 8%, transparent) !important; }
      &:last-child .ui-td { border-bottom: none !important; }
    }

    .col-check { width: 52px; padding: 0 4px 0 16px !important; }
    .col-actions { width: 80px; text-align: right !important; }

    /* Cell badge */
    .cell-badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 999px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
      &--primary  { background: color-mix(in srgb, var(--app-primary) 15%, transparent); color: var(--app-primary); }
      &--accent   { background: color-mix(in srgb, var(--app-accent) 15%, transparent); color: var(--app-accent); }
      &--success  { background: #d1fae5; color: #065f46; }
      &--warning  { background: #fef3c7; color: #92400e; }
      &--danger   { background: #fee2e2; color: #991b1b; }
      &--info     { background: #dbeafe; color: #1e40af; }
      &--neutral  { background: var(--app-border); color: var(--app-text-secondary); }
    }

    /* Row action button */
    .row-action-btn {
      width: 30px; height: 30px; border-radius: 6px; border: none;
      background: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: var(--app-text-muted); transition: all var(--app-transition); float: right;
      mat-icon { font-size: 18px; }
      &:hover { background: var(--app-border); color: var(--app-text-primary); }
    }

    /* Empty state */
    .no-data-cell { padding: 0 !important; border: none !important; }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 8px; padding: 48px 16px;
      color: var(--app-text-muted);
    }
    .empty-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.4; }

    /* Danger menu item */
    ::ng-deep .danger-item { color: #ef4444 !important; mat-icon { color: #ef4444 !important; } }

    /* Paginator */
    .ui-paginator {
      border-top: 1px solid var(--app-border);
      background: var(--app-surface-card) !important;
      color: var(--app-text-secondary) !important;
    }
  `]
})
export class UiTableComponent implements OnChanges, AfterViewInit {

  /* ── Inputs ───────────────────────────────── */
  title          = input<string>('');
  columns        = input<UiTableColumn[]>([]);
  data           = input<any[]>([]);
  loading        = input<boolean>(false);
  selectable     = input<boolean>(false);
  searchable     = input<boolean>(true);
  exportable     = input<boolean>(false);
  hasActions     = input<boolean>(false);
  paginated      = input<boolean>(true);
  pageSize       = input<number>(10);
  pageSizeOptions= input<number[]>([5, 10, 25, 50]);
  stickyHeader   = input<boolean>(true);
  emptyMessage   = input<string>('No data found');

  /* ── Outputs ──────────────────────────────── */
  rowClick      = output<any>();
  rowView       = output<any>();
  rowEdit       = output<any>();
  rowDelete     = output<any>();
  deleteSelected= output<any[]>();
  sortChange    = output<Sort>();
  searchChange  = output<string>();

  /* ── Internal state ──────────────────────── */
  @ViewChild(MatSort)      sort!: MatSort;
  @ViewChild('paginator')  paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);
  selection  = new SelectionModel<any>(true, []);
  searchValue = '';

  displayedColumns = computed(() => {
    const cols: string[] = [];
    if (this.selectable()) cols.push('__select');
    cols.push(...this.columns().map(c => c.key));
    if (this.hasActions()) cols.push('__actions');
    return cols;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data();
      this.selection.clear();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort      = this.sort;
    this.dataSource.paginator = this.paginated() ? this.paginator : null!;
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.filteredData.length
        && this.dataSource.filteredData.length > 0;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.filteredData.forEach(r => this.selection.select(r));
    }
  }

  onSearch(val: string): void {
    this.dataSource.filter = val.trim().toLowerCase();
    this.searchChange.emit(val);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onExport(): void {
    const cols = this.columns();
    const rows = this.dataSource.filteredData;
    const header = cols.map(c => c.label).join(',');
    const body   = rows.map(r => cols.map(c => `"${r[c.key] ?? ''}"`).join(',')).join('\n');
    const blob   = new Blob([header + '\n' + body], { type: 'text/csv' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href = url; a.download = (this.title() || 'table') + '.csv';
    a.click(); URL.revokeObjectURL(url);
  }
}
