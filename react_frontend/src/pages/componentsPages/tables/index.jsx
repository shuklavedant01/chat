import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import PageHeader from '@/components/pageHeader';
import BasicTable from './basicTable';

import DataTabled from './dataTables';

function TablesComponents() {
  return (
    <>
      <PageHeader title="Tables Elements">
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
          <Typography color="text.tertiary">Tables</Typography>
        </Breadcrumbs>
      </PageHeader>

      <Stack spacing={5}>
        <BasicTable />
        <DataTabled />
      </Stack>
    </>
  );
}

export default TablesComponents;
