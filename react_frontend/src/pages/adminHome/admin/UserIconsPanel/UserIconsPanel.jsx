// UserIconsPanel.jsx
import { Box, Avatar, Tooltip } from '@mui/material';

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Mike' },
  { id: 3, name: 'Sara' },
];

function UserIconsPanel({ onUserSelect, selectedUser }) {
  return (
    <Box
      width="70px"
      bgcolor="#f8f8f8"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={2}
      sx={{ borderRight: '1px solid #ddd' }}
    >
      {users.map((user) => (
        <Tooltip key={user.id} title={user.name} placement="right">
          <Avatar
            onClick={() => onUserSelect(user)}
            sx={{
              mb: 2,
              cursor: 'pointer',
              border: selectedUser?.id === user.id ? '2px solid #1976d2' : '2px solid transparent',
              transition: '0.3s',
            }}
          >
            {user.name[0]}
          </Avatar>
        </Tooltip>
      ))}
    </Box>
  );
}

export default UserIconsPanel;
