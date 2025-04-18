import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuario/usuario.component').then((m) => m.UsuarioComponent),
      },

      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/productos/productos.component').then((m) => m.ProductosComponent),
      },

      {
        path: 'categorias',
        loadComponent : () =>
          import('./pages/categorias/categorias.component').then(
            (m) => m.CategoriasComponent
          ),
      },
      
      {
        path: 'catalogo',
        loadComponent: () =>
          import('./pages/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./pages/carrito/carrito.component').then((m) => m.CarritoComponent),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
