import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login — DesignSys',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard — DesignSys',
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./features/components/components.component').then(m => m.ComponentsComponent),
        title: 'Component Library — DesignSys',
      },
      {
        path: 'theme-settings',
        loadComponent: () =>
          import('./features/theme-settings/theme-settings.component').then(m => m.ThemeSettingsComponent),
        title: 'Colors & Theme — DesignSys',
      },
      {
        path: 'tables',
        loadComponent: () =>
          import('./features/tables/tables.component').then(m => m.TablesComponent),
        title: 'Tables — DesignSys',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then(m => m.UsersComponent),
        title: 'Users — DesignSys',
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./features/posts/posts.component').then(m => m.PostsComponent),
        title: 'Posts — DesignSys',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
