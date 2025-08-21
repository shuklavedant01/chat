import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function AdminHomePage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>Welcome, Admin! This is your home page.</Typography>
    </Container>
  );
}
