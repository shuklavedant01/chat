import { useState } from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CardHeader from '@/components/cardHeader';

import HoursSection from './hoursSection';
import ReportSection from './reportSection';
import PopularProductsSection from './popularProductsSection';

function Dashboard5() {
  return (
    <>
      <Header />
      <TabsNav />
      <HoursSection />
      <Divider
        sx={{
          my: 8,
        }}
      />
      <ReportSection />
      <Divider
        sx={{
          my: 8,
        }}
      />
      <PopularProductsSection />
    </>
  );
}

function Header() {
  return (
    <CardHeader
      sx={{
        mt: 4,
      }}
      size="large"
      title="Good morning, Katherine!"
      subtitle={`Today is ${new Date().toLocaleDateString('default', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`}
    >
      <Stack
        pt={{ xs: 5, sm: 0 }}
        divider={<Divider orientation="vertical" flexItem />}
        direction="row"
        alignItems="center"
        spacing={3}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" fontSize={35} display="inline">
            $1,433
          </Typography>
          <Typography variant="caption" textTransform="uppercase">
            Earnings <br />
            for today
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" fontSize={35} display="inline">
            $296
          </Typography>
          <Typography variant="caption" textTransform="uppercase">
            Expenses <br />
            for today
          </Typography>
        </Stack>
      </Stack>
    </CardHeader>
  );
}

function TabsNav() {
  const [value, setValue] = useState(0);
  const [slot, setSlot] = useState('Today');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        aria-label="grap type"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <Tab label="Overview" />
        <Tab label="Employee" />
        <Tab label="Products" />
        <Tab label="Misc" />
        <Box flexGrow={1} />
        {/* <Stack
					spacing={0}
					direction="row"
					divider={<Divider orientation="vertical" flexItem />}
				>
					{['Today', 'This Week', 'This Month'].map((tab, i) => (
						<Button key={i} size="small">
							{tab}
						</Button>
					))}
				</Stack> */}
        <Stack direction="row" alignItems="center" spacing={0}>
          {['Today', 'This Week', 'This Month'].map((tab, i) => (
            <Button
              key={i}
              size="small"
              onClick={() => setSlot(tab)}
              variant={slot === tab ? 'outlined' : 'text'}
              sx={{
                color: slot === tab ? 'primary.main' : 'text.secondary',
              }}
            >
              {tab}
            </Button>
          ))}
        </Stack>
      </Tabs>
    </Box>
  );
}

export default Dashboard5;
