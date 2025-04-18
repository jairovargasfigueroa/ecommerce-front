import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Analytics',
    iconName: 'solar:widget-add-line-duotone',
    route: 'https://materialm-angular-main.netlify.app/dashboards/dashboard1',
    chip: true,
    external: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
  },

  
  {
    displayName: 'Usuarios',
    iconName: 'solar:bag-3-line-duotone', // Puedes usar cualquier ícono de Solar Icons
    route: '/usuarios',             // Debe coincidir con la ruta configurada
    roles: ['administrador','cliente'] // Solo el rol administrador puede acceder a esta ruta
  },

  {
    divider: true,
    navCap: 'Apps',
  },

  {
    displayName: 'Productos',
    iconName: 'solar:bag-3-line-duotone', // Puedes usar cualquier ícono de Solar Icons
    route: '/productos',             // Debe coincidir con la ruta configurada
    roles: ['administrador','cliente'] // Solo el rol administrador puede acceder a esta ruta
  },

  {
    displayName: 'Categorias',
    iconName: 'solar:checklist-bold', // Puedes usar cualquier ícono de Solar Icons
    route: '/categorias',             // Debe coincidir con la ruta configurada
    roles: ['administrador'] // Solo el rol administrador puede acceder a esta ruta
  },

  {
    displayName: 'Catalogo',
    iconName: 'solar:bag-3-line-duotone', // Puedes usar cualquier ícono de Solar Icons
    route: '/catalogo',             // Debe coincidir con la ruta configurada
    roles: ['administrador','cliente'] // Solo el rol administrador puede acceder a esta ruta
  },

  {
    displayName: 'Carrito',
    iconName: 'solar:bag-3-line-duotone', // Puedes usar cualquier ícono de Solar Icons
    route: '/carrito',             // Debe coincidir con la ruta configurada
    roles: ['administrador','cliente'] // Solo el rol administrador puede acceder a esta ruta
  },

  {
    navCap: 'Ui Components',
    divider: true
  },
  {
    displayName: 'Badge',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'solar:danger-circle-line-duotone',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'solar:bookmark-square-minimalistic-line-duotone',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'solar:text-field-focus-line-duotone',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/tables',
  },
  

  {
    divider: true,
    navCap: 'Pages',
  },

  {
    navCap: 'Extra',
    divider: true
  },
  {
    displayName: 'Icons',
    iconName: 'solar:sticker-smile-circle-2-line-duotone',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/sample-page',
  },

  {
    divider: true,
    navCap: 'Forms',
  },
  
  
  {
    divider: true,
    navCap: 'Tables',
  },
  
  {
    divider: true,
    navCap: 'Chart',
  },
  
  {
    divider: true,
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'solar:lock-keyhole-minimalistic-line-duotone',
    route: '/authentication',
    children: [
      {
        displayName: 'Login',
         subItemIcon: true,
        iconName: 'solar:round-alt-arrow-right-line-duotone',
        route: '/authentication/login',
      },
    ],
  },
  {
    displayName: 'Register',
    iconName: 'solar:user-plus-rounded-line-duotone',
    route: '/authentication',
    children: [
      {
        displayName: 'Register',
         subItemIcon: true,
        iconName: 'solar:round-alt-arrow-right-line-duotone',
        route: '/authentication/register',
      },
    ],
  },
  {
    displayName: 'Forgot Pwd',
    iconName: 'solar:password-outline',
    route: '/authentication',
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
    children: [
      {
        displayName: 'Side Forgot Pwd',
         subItemIcon: true,
        iconName: 'solar:round-alt-arrow-right-line-duotone',
        route: 'https://materialm-angular-main.netlify.app/authentication/side-forgot-pwd',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
      },
      {
        displayName: 'Boxed Forgot Pwd',
         subItemIcon: true,
        iconName: 'solar:round-alt-arrow-right-line-duotone',
        route: 'https://materialm-angular-main.netlify.app/authentication/boxed-forgot-pwd',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
      },
    ],
  },
  
];
