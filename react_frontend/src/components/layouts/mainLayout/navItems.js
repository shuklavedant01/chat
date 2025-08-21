import { v4 as uuid } from 'uuid';
// Icons
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';

/**
 * @example
 * {
 *	id: number,
 *	type: "group" | "item",
 *	title: string,
 *	Icon: NodeElement
 *	menuChildren?: {title: string, href: string}[]
 *  menuMinWidth?: number
 * }
 */

const NAV_LINKS_CONFIG = [
  // Admin top menu group
  {
    id: uuid(),
    type: 'group',
    title: 'Accounts Management',
    allowedRoles: ['Admin'],
    menuChildren: [
      {
        title: 'Create Account',
        href: '/admin/create-account',
      },
      {
        title: 'Update Account',
        href: '/admin/update-account',
      },
      {
        title: 'Staff Role Management',
        href: '/admin/staff-role-management',
      },
    ],
  },
  {
    id: uuid(),
    type: 'group',
    title: 'Access Management',
    allowedRoles: ['Admin'],
    menuChildren: [
      {
        title: 'Role Access',
        href: '/admin/role-access',
      },
      {
        title: 'Department Access',
        href: '/admin/department-access',
      },
    ],
  },
  // User top menu group
  {
    id: uuid(),
    type: 'group',
    title: 'Dashboards',
    allowedRoles: ['L1', 'EndUser'],
    menuChildren: [
      {
        title: 'Dashboard01',
        href: '/dashboards/dashboard1',
      },
      {
        title: 'Dashboard02',
        href: '/dashboards/dashboard2',
      },
    ],
  },
  {
    id: uuid(),
    type: 'group',
    title: 'Some Menu',
    allowedRoles: ['L1', 'EndUser'],
    menuChildren: [
      {
        title: 'User Option 1',
        href: '/user/option1',
      },
      {
        title: 'User Option 2',
        href: '/user/option2',
      },
    ],
  },
  {
    id: uuid(),
    type: 'group',
    title: 'Components',
    Icon: GridViewOutlinedIcon,
    allowedRoles: ['L1', 'EndUser'],
    menuChildren: [
      {
        title: 'Forms',
        href: '/components/forms',
      },
      {
        title: 'Tables',
        href: '/components/tables',
      },
      {
        title: 'Modal',
        href: '/components/modal',
      },
      {
        title: 'Loaders',
        href: '/components/loaders',
      },
      {
        title: 'Snackbar/Toast',
        href: '/components/snackbar',
      },
      {
        title: 'Carousel',
        href: '/components/carousel',
      },
      {
        title: 'Navigation',
        // navbar
        href: '/components/navigation',
      },
      {
        title: 'UI Elements',
        type: 'group',
        menuChildren: [
          {
            title: 'Card',
            href: '/components/card',
          },
          {
            title: 'CardHeader',
            href: '/components/cardHeader',
          },
          {
            title: 'PageHeader',
            href: '/components/pageHeader',
          },
          /* {
            title: 'Paper',
            href: '/components/ui/paper',
          }, 
          {
            title: 'Buttons',
            href: '/components/buttons',
          },
          */
        ],
      },

      {
        title: 'Level 0',
        type: 'group',
        menuChildren: [
          {
            title: 'Level 1a',
            href: '/1a',
          },
          {
            title: 'Level 1b',
            type: 'group',
            menuChildren: [
              {
                title: 'Level 2a',
                href: '/2a',
              },
              {
                title: 'Level 2b',
                href: '/2b',
              },
              {
                title: 'Level 2c',
                type: 'group',
                menuChildren: [
                  {
                    title: 'Level 3a',
                    href: '/3a',
                  },
                  {
                    title: 'Level 3b',
                    type: 'group',
                    menuChildren: [
                      {
                        title: 'Level 4a',
                        href: '/3b',
                      },
                    ],
                  },
                  {
                    title: 'Level 3c',
                    href: '/3c',
                  },
                ],
              },
            ],
          },
          {
            title: 'Level 1c',
            href: '/1c',
          },
        ],
      },
    ],
  },
  {
    id: uuid(),
    type: 'group',
    title: 'Pages',
    Icon: AutoStoriesOutlinedIcon,
    allowedRoles: ['L1', 'EndUser'],
    menuChildren: [
      {
        id: uuid(),
        title: 'Sign in',
        type: 'group',
        menuChildren: [
          {
            title: 'Sign in',
            href: '/pages/login',
          },
          {
            title: 'Sign in Simple',
            href: '/pages/login/simple',
          },
          {
            title: 'Sign in Split',
            href: '/pages/login/split',
          },
        ],
      },
      {
        id: uuid(),
        title: 'Sign up',
        type: 'group',
        menuChildren: [
          {
            title: 'Sign up',
            href: '/pages/signup',
          },
          {
            title: 'Sign up Simple',
            href: '/pages/signup/simple',
          },
          {
            title: 'Sign up Split',
            href: '/pages/signup/split',
          },
        ],
      },
      {
        title: 'WIP',
        href: '/pages/wip',
      },
      {
        title: 'Account Settings',
        href: '/pages/settings',
      },
      {
        title: 'Notifications',
        href: '/pages/notifications',
      },
      {
        title: 'Profile WIP',
        href: '/pages/login',
      },
      {
        id: uuid(),
        title: 'Error Pages',
        type: 'group',
        menuChildren: [
          {
            title: '403 Unauthorized',
            href: '/pages/error/403',
          },
          {
            title: '404 Not Found',
            href: '/pages/error/404',
          },
          {
            title: '500 Internal Server',
            href: '/pages/error/500',
          },
          {
            title: '503 Service Unavailable',
            href: '/pages/error/503',
          },
          {
            title: '505 Forbidden',
            href: '/pages/error/505',
          },
        ],
      },
      {
        id: uuid(),
        title: 'Pricing Pages',
        type: 'group',
        menuChildren: [
          {
            title: 'Pricing 1',
            href: '/pages/pricing/pricing1',
          },
          {
            title: 'Pricing 2',
            href: '/pages/pricing/pricing2',
          },
        ],
      },
      {
        id: uuid(),
        title: 'Landing Pages WIP',
        type: 'group',
        menuChildren: [
          {
            title: 'Landing01',
            href: '/pages/landing/landing1',
          },
          {
            title: 'Landing02',
            href: '/pages/landing/landing2',
          },
          {
            title: 'Landing03',
            href: '/pages/landing/landing3',
          },
          {
            title: 'Landing04',
            href: '/pages/landing/landing4',
          },
        ],
      },
    ],
  },
  {
    id: uuid(),
    type: 'group',
    title: 'Theme',
    Icon: PaletteOutlinedIcon,
    allowedRoles: [],
    menuChildren: [
      {
        title: 'Paleta de Colores',
        href: '/theme/colors',
      },
      {
        title: 'Tipografia',
        href: '/theme/typography',
      },
      {
        title: 'Sombras',
        href: '/theme/boxShadow',
      },

      /* {
        title: 'Iconos',
        href: '/theme/icons',
      }, */
      {
        title: 'Utilities WIP',
        // Breakpoints
        href: '/theme/utils',
      },
      // libraries/ packgaes ej.> moment
    ],
  },
  {
    id: uuid(),
    type: 'group',
    title: 'Apps',
    Icon: InventoryOutlinedIcon,
    allowedRoles: [],
    menuChildren: [
      {
        title: 'Ecommerce WIP',
        href: '/profile WIP',
      },
      {
        title: 'Social Feed WIP',
        href: '/profile WIP',
      },
      {
        title: 'Calendar WIP',
        href: '/profile WIP',
      },
      {
        title: 'Chat WIP',
        href: '/profile WIP',
      },
    ],
  },
  {
    id: uuid(),
    type: 'item',
    title: 'Sample Tab',
    Icon: WebOutlinedIcon,
    href: '/samplePage',
    allowedRoles: [],
  },
  {
    id: uuid(),
    type: 'item',
    title: 'Entry Form', // ✅ NEW ENTRY
    Icon: WebOutlinedIcon,
    href: '/entry-form',
    allowedRoles: [],
  },
  {
    id: uuid(),
    type: 'item',
    title: 'Widgets',
    Icon: WidgetsOutlinedIcon,
    href: '/widgets',
    allowedRoles: [],
  },
  {
    id: uuid(),
    type: 'item',
    title: 'Perfil',
    Icon: AccountCircleOutlinedIcon,
    href: '/profile',
    allowedRoles: [],
  },
];

export default NAV_LINKS_CONFIG;
