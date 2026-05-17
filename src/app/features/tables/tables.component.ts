import { Component, signal } from '@angular/core';
import { UiTableComponent, UiTableColumn } from '../../shared/ui/ui-table/ui-table.component';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { inject } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  orders: number;
  revenue: string;
}

const MOCK_USERS: User[] = [
  { id: 1,  name: 'Alice Johnson',   email: 'alice@example.com',   role: 'Admin',    status: 'Active',   joined: '2024-01-12', orders: 42,  revenue: '$4,210' },
  { id: 2,  name: 'Bob Smith',       email: 'bob@example.com',     role: 'Editor',   status: 'Active',   joined: '2024-02-08', orders: 28,  revenue: '$1,890' },
  { id: 3,  name: 'Carol Williams',  email: 'carol@example.com',   role: 'Viewer',   status: 'Inactive', joined: '2024-03-15', orders: 5,   revenue: '$340'   },
  { id: 4,  name: 'David Brown',     email: 'david@example.com',   role: 'Editor',   status: 'Active',   joined: '2024-03-22', orders: 61,  revenue: '$7,820' },
  { id: 5,  name: 'Eve Martinez',    email: 'eve@example.com',     role: 'Admin',    status: 'Active',   joined: '2024-04-01', orders: 19,  revenue: '$2,100' },
  { id: 6,  name: 'Frank Garcia',    email: 'frank@example.com',   role: 'Viewer',   status: 'Banned',   joined: '2024-04-10', orders: 0,   revenue: '$0'     },
  { id: 7,  name: 'Grace Lee',       email: 'grace@example.com',   role: 'Editor',   status: 'Active',   joined: '2024-05-03', orders: 34,  revenue: '$3,650' },
  { id: 8,  name: 'Hank Wilson',     email: 'hank@example.com',    role: 'Viewer',   status: 'Pending',  joined: '2024-05-18', orders: 2,   revenue: '$120'   },
  { id: 9,  name: 'Isla Davis',      email: 'isla@example.com',    role: 'Editor',   status: 'Active',   joined: '2024-06-07', orders: 55,  revenue: '$6,300' },
  { id: 10, name: 'Jack Miller',     email: 'jack@example.com',    role: 'Admin',    status: 'Active',   joined: '2024-06-21', orders: 73,  revenue: '$9,400' },
  { id: 11, name: 'Karen Moore',     email: 'karen@example.com',   role: 'Viewer',   status: 'Inactive', joined: '2024-07-02', orders: 8,   revenue: '$560'   },
  { id: 12, name: 'Leo Taylor',      email: 'leo@example.com',     role: 'Editor',   status: 'Active',   joined: '2024-07-15', orders: 47,  revenue: '$5,100' },
  { id: 13, name: 'Mia Anderson',    email: 'mia@example.com',     role: 'Viewer',   status: 'Pending',  joined: '2024-08-01', orders: 1,   revenue: '$80'    },
  { id: 14, name: 'Nate Thomas',     email: 'nate@example.com',    role: 'Editor',   status: 'Active',   joined: '2024-08-20', orders: 39,  revenue: '$4,700' },
  { id: 15, name: 'Olivia Jackson',  email: 'olivia@example.com',  role: 'Admin',    status: 'Active',   joined: '2024-09-05', orders: 82,  revenue: '$11,200'},
];

const STATUS_BADGES: Record<string, any> = {
  Active:   'success',
  Inactive: 'neutral',
  Pending:  'warning',
  Banned:   'danger',
};

const ROLE_BADGES: Record<string, any> = {
  Admin:  'primary',
  Editor: 'accent',
  Viewer: 'info',
};

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [UiTableComponent, UiCardComponent, UiButtonComponent, MatSnackBarModule],
  template: `
    <div class="tables-page animate-fadeInUp">

      <!-- Page header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Tables</h1>
          <p class="page-subtitle">
            <code>ui-table</code> — extending Angular Material's mat-table with sorting, pagination, filtering, selection, badges &amp; export.
          </p>
        </div>
        <ui-button variant="primary" icon="person_add" (click)="addUser()">Add User</ui-button>
      </div>

      <!-- Full-featured table -->
      <ui-table
        id="users-table"
        title="Users"
        [columns]="columns"
        [data]="tableData()"
        [loading]="loading()"
        [selectable]="true"
        [searchable]="true"
        [exportable]="true"
        [hasActions]="true"
        [paginated]="true"
        [pageSize]="8"
        [pageSizeOptions]="[5, 8, 15, 25]"
        emptyMessage="No users found"
        (rowClick)="onRowClick($event)"
        (rowView)="onAction('Viewing', $event)"
        (rowEdit)="onAction('Editing', $event)"
        (rowDelete)="onDeleteRow($event)"
        (deleteSelected)="onDeleteSelected($event)"
        (searchChange)="onSearch($event)"
      />

      <!-- Simple read-only table demo -->
      <ui-card title="Simple Read-Only Table" subtitle="No selection, no pagination" headerIcon="table_rows" variant="elevated">
        <ui-table
          id="simple-table"
          [columns]="simpleColumns"
          [data]="simpleData"
          [selectable]="false"
          [searchable]="true"
          [paginated]="false"
          [hasActions]="false"
          emptyMessage="Nothing here"
        />
      </ui-card>

      <!-- Empty state demo -->
      <ui-card title="Empty State" subtitle="Table with no data" headerIcon="inbox" variant="elevated">
        <ui-table
          id="empty-table"
          [columns]="columns"
          [data]="[]"
          [selectable]="false"
          [searchable]="false"
          [paginated]="false"
          [hasActions]="false"
          emptyMessage="No records yet. Add one to get started."
        />
      </ui-card>

    </div>
  `,
  styles: [`
    .tables-page { display: flex; flex-direction: column; gap: 20px; max-width: 1300px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .page-title  { font-size: 26px; font-weight: 700; color: var(--app-text-primary); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
    code { background: var(--app-border); padding: 1px 6px; border-radius: 4px; font-size: 13px; }
  `]
})
export class TablesComponent {
  private snack = inject(MatSnackBar);

  loading   = signal(false);
  tableData = signal<User[]>([...MOCK_USERS]);

  /* ── Full table columns ── */
  columns: UiTableColumn[] = [
    { key: 'id',      label: '#',       sortable: true,  width: '60px',  align: 'center' },
    { key: 'name',    label: 'Name',    sortable: true },
    { key: 'email',   label: 'Email',   sortable: true },
    {
      key: 'role', label: 'Role', sortable: true,
      badge: ROLE_BADGES,
    },
    {
      key: 'status', label: 'Status', sortable: true,
      badge: STATUS_BADGES,
    },
    { key: 'joined',  label: 'Joined',  sortable: true },
    { key: 'orders',  label: 'Orders',  sortable: true,  align: 'center' },
    { key: 'revenue', label: 'Revenue', sortable: true,  align: 'right'  },
  ];

  /* ── Simple table columns ── */
  simpleColumns: UiTableColumn[] = [
    { key: 'id',      label: '#',      width: '60px', align: 'center' },
    { key: 'name',    label: 'Name' },
    { key: 'role',    label: 'Role',    badge: ROLE_BADGES },
    { key: 'orders',  label: 'Orders',  align: 'center' },
    { key: 'revenue', label: 'Revenue', align: 'right' },
  ];

  simpleData = MOCK_USERS.slice(0, 5);

  /* ── Event handlers ── */
  onRowClick(row: User): void {
    this.snack.open(`Clicked: ${row.name}`, 'OK', { duration: 1500 });
  }

  onAction(action: string, row: User): void {
    this.snack.open(`${action}: ${row.name}`, 'OK', { duration: 2000 });
  }

  onDeleteRow(row: User): void {
    this.tableData.update(data => data.filter(u => u.id !== row.id));
    this.snack.open(`Deleted: ${row.name}`, 'Undo', { duration: 3000 });
  }

  onDeleteSelected(rows: User[]): void {
    const ids = new Set(rows.map(r => r.id));
    this.tableData.update(data => data.filter(u => !ids.has(u.id)));
    this.snack.open(`Deleted ${rows.length} rows`, 'OK', { duration: 2500 });
  }

  onSearch(val: string): void {
    // search is handled internally by mat-table's filterPredicate
  }

  addUser(): void {
    const id = Math.max(...this.tableData().map(u => u.id)) + 1;
    const newUser: User = {
      id, name: `New User ${id}`, email: `user${id}@example.com`,
      role: 'Viewer', status: 'Pending',
      joined: new Date().toISOString().slice(0, 10),
      orders: 0, revenue: '$0',
    };
    this.tableData.update(d => [newUser, ...d]);
    this.snack.open('User added!', 'OK', { duration: 2000 });
  }
}
