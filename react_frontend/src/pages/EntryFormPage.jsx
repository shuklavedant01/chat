import { Container, Typography } from '@mui/material';
import EntryForm from '@/components/EntryForm';

function EntryFormPage() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3 }}>
        Entry Form Page
      </Typography>
      <EntryForm />
    </Container>
  );
}

export default EntryFormPage;
