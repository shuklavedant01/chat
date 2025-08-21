// src/pages/userHome/index.jsx

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function UserHomePage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        User Dashboard
      </Typography>
      <Typography>Welcome! This is your user home page—put user-specific widgets, forms, etc. here.</Typography>
    </Container>
  );
}
