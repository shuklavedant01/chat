import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Pagination,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  DialogContentText,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreIcon from '@mui/icons-material/Restore';
import axios from 'axios';

function UpdateAccount() {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [dropdownOptions, setDropdownOptions] = useState({
    roles: [],
    departments: [],
    designations: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const rowsPerPage = 5;

  const [filters, setFilters] = useState({
    username: '',
    role: '',
    department: '',
    designation: '',
  });

  const fetchUsers = () => {
    axios
      .get('http://localhost:5173/accounts/api/all_users/', { withCredentials: true })
      .then((res) => {
        const users = res.data.users.map((user) => ({
          ...user,
          is_active: user.is_active !== undefined ? user.is_active : true,
        }));
        setUserData(users);
        setFilteredData(users);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  };

  const fetchDropdownData = async () => {
    try {
      const [rolesRes, departmentsRes, designationsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/accounts/api/roles/'),
        axios.get('http://127.0.0.1:8000/accounts/api/departments/'),
        axios.get('http://127.0.0.1:8000/accounts/api/designations/'),
      ]);

      setDropdownOptions({
        roles: rolesRes.data,
        departments: departmentsRes.data,
        designations: designationsRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDropdownData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = userData.filter(
      (user) =>
        user.username.toLowerCase().includes(newFilters.username.toLowerCase()) &&
        user.role.toLowerCase().includes(newFilters.role.toLowerCase()) &&
        user.department.toLowerCase().includes(newFilters.department.toLowerCase()) &&
        user.designation.toLowerCase().includes(newFilters.designation.toLowerCase()),
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setOpenDialog(true);
  };

  const handleUpdateSubmit = () => {
    axios
      .put(`http://localhost:5173/accounts/api/update_user/${editUser.id}/`, editUser, {
        withCredentials: true,
      })
      .then(() => {
        const updated = userData.map((u) => (u.id === editUser.id ? editUser : u));
        setUserData(updated);
        setFilteredData(updated);
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      })
      .catch((err) => {
        console.error('Update error:', err);
        setSnackbar({
          open: true,
          message: 'Error updating user',
          severity: 'error',
        });
      });
  };

  const handleDeleteConfirm = () => {
    const user = selectedUser;
    if (user.is_active) {
      axios
        .put(
          `http://localhost:5173/accounts/api/update_user/${user.id}/`,
          { ...user, is_active: false },
          { withCredentials: true },
        )
        .then(() => {
          const updated = userData.map((u) => (u.id === user.id ? { ...u, is_active: false } : u));
          setUserData(updated);
          setFilteredData(updated);
          setSnackbar({ open: true, message: 'User deactivated', severity: 'info' });
        })
        .catch((err) => console.error('Soft delete error:', err));
    } else {
      axios
        .delete(`http://localhost:5173/accounts/api/delete_user/${user.id}/`, {
          withCredentials: true,
        })
        .then(() => {
          const updated = userData.filter((u) => u.id !== user.id);
          setUserData(updated);
          setFilteredData(updated);
          setSnackbar({ open: true, message: 'User permanently deleted', severity: 'warning' });
        })
        .catch((err) => console.error('Hard delete error:', err));
    }
    setConfirmDialogOpen(false);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleRestore = (user) => {
    axios
      .put(
        `http://localhost:5173/accounts/api/update_user/${user.id}/`,
        { ...user, is_active: true },
        { withCredentials: true },
      )
      .then(() => {
        const updated = userData.map((u) => (u.id === user.id ? { ...u, is_active: true } : u));
        setUserData(updated);
        setFilteredData(updated);
        setSnackbar({ open: true, message: 'User restored', severity: 'success' });
      })
      .catch((err) => console.error('Restore error:', err));
  };

  // ✅ Pagination calculations (including serial number logic)
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          User Accounts
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={() => setShowFilters((prev) => !prev)}>
            {showFilters ? 'Hide Search' : 'Search'}
          </Button>
          <Button variant="contained">New Entry +</Button>
        </Box>
      </Box>

      {showFilters && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2}>
            {/* Username Filter - TextField */}
            <Grid item xs={12} md={3}>
              <TextField
                name="username"
                label="Filter by Username"
                value={filters.username}
                onChange={handleFilterChange}
                size="small"
                fullWidth
              />
            </Grid>

            {/* Role Filter - Select Dropdown */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select name="role" value={filters.role} onChange={handleFilterChange} label="Role">
                  <MenuItem value="">All</MenuItem>
                  {dropdownOptions.roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Department Filter - Select Dropdown */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select name="department" value={filters.department} onChange={handleFilterChange} label="Department">
                  <MenuItem value="">All</MenuItem>
                  {dropdownOptions.departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Designation Filter - Select Dropdown */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Designation</InputLabel>
                <Select
                  name="designation"
                  value={filters.designation}
                  onChange={handleFilterChange}
                  label="Designation"
                >
                  <MenuItem value="">All</MenuItem>
                  {dropdownOptions.designations.map((desig) => (
                    <MenuItem key={desig.id} value={desig.name}>
                      {desig.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>S.No.</TableCell> {/* 👈 Serial Number column */}
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((user, index) => (
              <TableRow key={user.id} sx={{ backgroundColor: user.is_active ? 'inherit' : '#fff4f4' }}>
                <TableCell>{indexOfFirstRow + index + 1}</TableCell> {/* 👈 Serial Number */}
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? 'Active' : 'Inactive'}
                    color={user.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <span>
                      <IconButton
                        size="small"
                        color="warning"
                        disabled={!user.is_active}
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  {user.is_active ? (
                    <Tooltip title="Deactivate">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(user)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Restore">
                        <IconButton size="small" color="primary" onClick={() => handleRestore(user)}>
                          <RestoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permanently Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(user)}>
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Email (Disabled) */}
            <Grid item xs={12} sm={6}>
              <TextField label="Email" value={editUser?.email || ''} fullWidth disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                value={editUser?.username || ''}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editUser?.role || ''}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  label="Role"
                >
                  {dropdownOptions.roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={editUser?.department || ''}
                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                  label="Department"
                >
                  {dropdownOptions.departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  value={editUser?.designation || ''}
                  onChange={(e) => setEditUser({ ...editUser, designation: e.target.value })}
                  label="Designation"
                >
                  {dropdownOptions.designations.map((desig) => (
                    <MenuItem key={desig.id} value={desig.name}>
                      {desig.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser?.is_active
              ? 'Are you sure you want to deactivate this user?'
              : 'Are you sure you want to permanently delete this user?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // 👈 Toast-style position
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UpdateAccount;
