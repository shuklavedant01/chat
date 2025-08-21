import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import PageHeader from '@/components/pageHeader';
import Navbar from '@/components/navbar';

import { navItems1, navItems1b, navItems2, navItems3, navItems4, navItems5, navItems6 } from './navItems';

function Navigation() {
  return (
    <>
      <PageHeader title="Navigation Elements">
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            textTransform: 'uppercase',
          }}
        >
          <Link underline="hover" href="#!">
            Inicio
          </Link>
          <Typography color="text.tertiary">Components</Typography>
          <Typography color="text.tertiary">Navigation</Typography>
        </Breadcrumbs>
      </PageHeader>

      {/* Optional: Add this if you meant to keep the label "Accounts Management" */}
      <Typography variant="h6" mt={5}>
        Accounts Management
      </Typography>

      <Typography variant="subtitle1" mt={5}>
        NavMenu
      </Typography>
      <Navbar navItems={navItems1} position="relative" />

      <Typography variant="subtitle1" mt={5}>
        NavMenu Icons
      </Typography>
      <Navbar navItems={navItems1b} position="relative" />

      <Typography variant="subtitle1" mt={5}>
        NavItem
      </Typography>
      <Navbar navItems={navItems2} position="relative" />

      <Typography variant="subtitle1" mt={5}>
        Group NavMenu
      </Typography>
      <Navbar navItems={navItems3} position="relative" />

      <Typography variant="subtitle1" mt={5}>
        Group NavItem
      </Typography>
      <Navbar navItems={navItems4} position="relative" />

      <Typography variant="subtitle1" mt={5}>
        Group Mixed
      </Typography>
      <Navbar navItems={navItems5} position="relative" />

      <Typography variant="subtitle1" mt={5}>
        Group Mixed no Icon
      </Typography>
      <Navbar navItems={navItems6} position="relative" />
    </>
  );
}

export default Navigation;
