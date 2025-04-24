import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth.guard';

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
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
        canActivate:[authGuard(['admin','cliente',])]
      },
      
      {
        path: 'confirmar-pedido',
        loadComponent: () =>
          import('./pages/pedidos/confirmar-pedido/confirmar-pedido.component').then((m) => m.ConfirmarPedidoComponent),
        canActivate:[authGuard(['cliente','admin'])]
      },

      {
        path: 'pago-exitoso',
        loadComponent: () =>
          import('./pages/pagos/pago-exitoso/pago-exitoso.component').then((m) => m.PagoExitosoComponent),
      },

      {
        path: 'pago-cancelado',
        loadComponent: () =>
          import('./pages/pagos/pago-cancelado/pago-cancelado.component').then((m) => m.PagoCanceladoComponent),
      },

      
      
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuario/usuario.component').then((m) => m.UsuarioComponent),
        canActivate:[authGuard(['admin'])]
      },

      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/productos/productos.component').then((m) => m.ProductosComponent),
        canActivate:[authGuard(['admin','cliente','delivery'])]
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
