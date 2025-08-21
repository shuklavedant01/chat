import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const entityConfig = [
  { key: 'roles', title: 'Roles', api: 'roles' },
  { key: 'departments', title: 'Departments', api: 'departments' },
  { key: 'designations', title: 'Designations', api: 'designations' },
];

function StaffRoleManagement() {
  const [data, setData] = useState({
    roles: [],
    departments: [],
    designations: [],
  });
  const [openDialog, setOpenDialog] = useState({ open: false, type: '', mode: 'add', item: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      const responses = await Promise.all(entityConfig.map((e) => axios.get(`/accounts/api/${e.api}/`)));
      const newData = {};
      entityConfig.forEach((e, idx) => {
        newData[e.key] = responses[idx].data;
      });
      setData(newData);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (type, mode, item = null) => {
    setOpenDialog({ open: true, type, mode, item });
  };

  const handleCloseDialog = () => {
    setOpenDialog({ open: false, type: '', mode: 'add', item: null });
  };

  const handleSave = async () => {
    const { type, mode, item } = openDialog;
    try {
      const url = `/accounts/api/${type}/${mode === 'edit' ? `${item.id}/` : ''}`;
      const method = mode === 'edit' ? 'put' : 'post';
      await axios[method](url, { name: item.name });
      setSnackbar({
        open: true,
        message: `${type} ${mode === 'edit' ? 'updated' : 'added'} successfully!`,
        severity: 'success',
      });
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error while saving', severity: 'error' });
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`/accounts/api/${type}/${id}/`);
      setSnackbar({ open: true, message: 'Deleted successfully', severity: 'warning' });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Staff Role Management
      </Typography>

      {entityConfig.map((section) => (
        <Box key={section.key} mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">{section.title}</Typography>
            <Button variant="contained" onClick={() => handleOpenDialog(section.api, 'add')}>
              Add {section.title.slice(0, -1)}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ background: '#f0f0f0' }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data[section.key].map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpenDialog(section.api, 'edit', item)}
                          size="small"
                          color="primary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(section.api, item.id)} size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>
          {openDialog.mode === 'edit' ? 'Edit' : 'Add'} {openDialog.type.slice(0, -1)}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={openDialog.item?.name || ''}
            onChange={(e) =>
              setOpenDialog((prev) => ({
                ...prev,
                item: { ...prev.item, name: e.target.value },
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StaffRoleManagement;
