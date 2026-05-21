import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { authGuard } from '../guards/auth.guard';

// 1. Component Registry Map matching component keys to dynamic import functions
const COMPONENT_REGISTRY: Record<string, () => Promise<any>> = {
  'login': () => import('../../features/auth/login/login.component').then(m => m.LoginComponent),
  'covid': () => import('../../features/covid-board/covidboard.component').then(m => m.CovidBoardComponent),
  'dashboard': () => import('../../features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  'components': () => import('../../features/components/components.component').then(m => m.ComponentsComponent),
  'theme-settings': () => import('../../features/theme-settings/theme-settings.component').then(m => m.ThemeSettingsComponent),
  'tables': () => import('../../features/tables/tables.component').then(m => m.TablesComponent),
  'users': () => import('../../features/users/users.component').then(m => m.UsersComponent),
  'posts': () => import('../../features/posts/posts.component').then(m => m.PostsComponent),
  'builder': () => import('../../features/page-builder/page-builder.component').then(m => m.PageBuilderComponent),
  'tickers': () => import('../../features/tickers/tickers.component').then(m => m.TickersComponent),
  'dynamic-sample': () => import('../dynamic-renderer/dynamic-page.component').then(m => m.DynamicPageComponent),
  'infinite': () => import('../../features/infinite-scroll/infinite-scroll').then(m => m.InfiniteScroll),

};

// 2. Generic Node Interface representing single point of truth for route + navigation
export interface AppRouteConfigNode {
  id: string;
  path?: string;
  title?: string;
  componentKey?: string;
  data?: any;
  menu?: {
    label: string;
    icon: string;
    route?: string;
    badge?: string;
  };
  children?: AppRouteConfigNode[];
}

// 3. Centralized JSON-like schema configuration
export const APP_ROUTES_MENU_CONFIG: AppRouteConfigNode[] = [
  {
    id: 'infinite',
    path: 'infinite',
    title: 'Infinite Scroll — SmarkUI',
    componentKey: 'infinite',
    menu: { label: 'Infinite Scroll', icon: 'scroll', route: '/infinite' }
  },
  {
    id: 'dashboard',
    path: '',
    title: 'Dashboard — SmarkUI',
    componentKey: 'dashboard',
    menu: { label: 'Dashboard', icon: 'dashboard', route: '/' }
  },
  {
    id: 'covid',
    path: 'covid',
    title: 'Dashboard — CovidBoard',
    componentKey: 'covid',
    menu: { label: 'Covid', icon: 'covid', route: '/covid' }
  },
  {
    id: 'resources',
    menu: { label: 'Resources', icon: 'folder' },
    children: [
      {
        id: 'users',
        path: 'users',
        title: 'Users — SmarkUI',
        componentKey: 'users',
        menu: { label: 'Users', icon: 'people', route: '/users' }
      },
      {
        id: 'posts',
        path: 'posts',
        title: 'Posts — SmarkUI',
        componentKey: 'posts',
        menu: { label: 'Posts', icon: 'article', route: '/posts' }
      }
    ]
  },
  {
    id: 'components',
    path: 'components',
    title: 'Component Library — SmarkUI',
    componentKey: 'components',
    menu: { label: 'Components', icon: 'widgets', route: '/components' }
  },
  {
    id: 'builder',
    path: 'builder',
    title: 'Page Builder — SmarkUI',
    componentKey: 'builder',
    menu: { label: 'Page Builder', icon: 'dashboard_customize', route: '/builder', badge: 'BETA' }
  },
  {
    id: 'dynamic-sample',
    path: 'dynamic-sample',
    title: 'Dynamic Page — SmarkUI',
    componentKey: 'dynamic-sample',
    menu: { label: 'Dynamic Page', icon: 'layers', route: '/dynamic-sample' },
    data: {
      pageData: {
        id: 'sample_page_1',
        title: 'Sample Dynamic Page',
        components: [
          {
            id: 'comp_1',
            type: 'CARD',
            properties: {
              title: 'Welcome to Dynamic Pages',
              subtitle: 'Rendered entirely from JSON metadata',
              variant: 'elevated',
              content: 'This page layout is not hardcoded in HTML. Instead, the route passes a JSON metadata object to the DynamicPageComponent, which iterates through the layout and renders the corresponding custom components.'
            }
          },
          {
            id: 'comp_2',
            type: 'DIVIDER',
            properties: { label: 'Interactive Elements' }
          },
          {
            id: 'comp_3',
            type: 'BUTTON',
            properties: { label: 'Click Me', variant: 'primary', icon: 'thumb_up' }
          },
          {
            id: 'comp_4',
            type: 'ALERT',
            properties: { type: 'success', title: 'Success!', message: 'The dynamic renderer is working perfectly.' }
          }
        ]
      }
    }
  },
  {
    id: 'tickers',
    path: 'tickers',
    title: 'Tickers — SmarkUI',
    componentKey: 'tickers',
    menu: { label: 'Tickers', icon: 'trending_up', route: '/tickers' }
  },
  {
    id: 'typography',
    path: 'typography',
    title: 'Typography — SmarkUI',
    componentKey: 'dashboard',
    menu: { label: 'Typography', icon: 'text_fields', route: '/typography' }
  },
  {
    id: 'colors',
    path: 'theme-settings',
    title: 'Colors & Theme — SmarkUI',
    componentKey: 'theme-settings',
    menu: { label: 'Colors & Theme', icon: 'palette', route: '/theme-settings', badge: 'NEW' }
  },
  {
    id: 'forms',
    path: 'forms',
    title: 'Forms — SmarkUI',
    componentKey: 'dashboard',
    menu: { label: 'Forms', icon: 'dynamic_form', route: '/forms' }
  },
  {
    id: 'tables',
    path: 'tables',
    title: 'Tables — SmarkUI',
    componentKey: 'tables',
    menu: { label: 'Tables', icon: 'table_chart', route: '/tables' }
  },
  {
    id: 'charts',
    path: 'charts',
    title: 'Charts — SmarkUI',
    componentKey: 'dashboard',
    menu: { label: 'Charts', icon: 'bar_chart', route: '/charts' }
  },
  {
    id: 'settings',
    path: 'settings',
    title: 'Settings — SmarkUI',
    componentKey: 'dashboard',
    menu: { label: 'Settings', icon: 'settings', route: '/settings' }
  }

];

// 4. Dynamic Router compiler
export function buildAngularRoutes(nodes: AppRouteConfigNode[]): Routes {
  const childrenRoutes: Routes = [];

  function traverse(configNodes: AppRouteConfigNode[], targetRoutes: Routes) {
    configNodes.forEach(node => {
      if (node.path !== undefined) {
        const routeObj: any = {
          path: node.path,
          title: node.title,
          data: node.data
        };

        if (node.componentKey && COMPONENT_REGISTRY[node.componentKey]) {
          routeObj.loadComponent = COMPONENT_REGISTRY[node.componentKey];
        }

        if (node.children && node.children.length > 0) {
          routeObj.children = [];
          traverse(node.children, routeObj.children);
        }

        targetRoutes.push(routeObj);
      } else if (node.children && node.children.length > 0) {
        traverse(node.children, targetRoutes);
      }
    });
  }

  traverse(nodes, childrenRoutes);

  return [
    {
      path: 'login',
      loadComponent: COMPONENT_REGISTRY['login'],
      title: 'Login — SmarkUI'
    },
    {
      path: '',
      component: LayoutComponent,
      canActivate: [authGuard],
      children: childrenRoutes
    },
    {
      path: '**',
      redirectTo: ''
    }
  ];
}

// 5. Dynamic Sidebar navigation menu compiler
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  children?: NavItem[];
  expanded?: boolean;
}

export function buildNavItems(nodes: AppRouteConfigNode[]): NavItem[] {
  const items: NavItem[] = [];

  nodes.forEach(node => {
    if (node.menu) {
      const item: NavItem = {
        id: node.id,
        label: node.menu.label,
        icon: node.menu.icon,
        route: node.menu.route,
        badge: node.menu.badge,
        expanded: false
      };

      if (node.children && node.children.length > 0) {
        item.children = buildNavItems(node.children);
      }

      items.push(item);
    }
  });

  return items;
}

// 6. Precompiled references exported for the application
export const appRoutes: Routes = buildAngularRoutes(APP_ROUTES_MENU_CONFIG);
export const appNavItems: NavItem[] = buildNavItems(APP_ROUTES_MENU_CONFIG);
