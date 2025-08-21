import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { Box, Grid, TextField, Button, Typography, Paper } from '@mui/material';

const CLIENT_ID = '751741622004-8cgf1u16nugodk2cmb98n9j6u4dvj22u.apps.googleusercontent.com'; // from Google Cloud
const API_KEY = 'AIzaSyBuTMUYb_GGeL6hMZTwzi2ywBPEz-R_ZAQ'; // from Google Cloud
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function CreateAccounts() {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
    file: null,
  });

  // Initialize Google API client
  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          console.log('Google API client initialized');
        });
    }
    gapi.load('client:auth2', initClient);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // Handle form submit and upload file
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert('Please select a file to upload.');
      return;
    }

    const GoogleAuth = gapi.auth2.getAuthInstance();
    if (!GoogleAuth.isSignedIn.get()) {
      await GoogleAuth.signIn();
    }

    const accessToken = GoogleAuth.currentUser.get().getAuthResponse().access_token;

    const metadata = {
      name: formData.file.name,
      mimeType: formData.file.type,
    };

    const uploadForm = new FormData();
    uploadForm.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    uploadForm.append('file', formData.file);

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: uploadForm,
    });

    const fileData = await res.json();
    console.log('Uploaded File Data:', fileData);
    alert(`File uploaded successfully! File ID: ${fileData.id}`);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          BASIC FORM INPUT OUTLINED
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          A basic form with Name, Department, Designation, and File Upload.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="department"
                label="Department"
                variant="outlined"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="designation"
                label="Designation"
                variant="outlined"
                value={formData.designation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px', justifyContent: 'flex-start' }}
              >
                {formData.file ? formData.file.name : 'Upload File'}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit & Upload
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreateAccounts;
