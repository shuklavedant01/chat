import { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import axios from 'axios';

function EntryForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/submit-form/', formData);
      console.log(`Form submitted: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ width: 300, margin: 'auto', mt: 5 }}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default EntryForm;
