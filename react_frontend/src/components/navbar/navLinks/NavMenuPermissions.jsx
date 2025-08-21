import React, { useEffect } from 'react';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import navItems from '../../components/layouts/mainLayout/navItems';

function NavMenuPermissions() {
  const { user } = useUser();
  const role = user?.role;

  // Guard: only render menu if user and role are present
  if (!user || !role) {
    console.log('[NavMenuPermissions] No user or role found, not rendering menu. User:', user);
    return null;
  }

  // Show only menu groups allowed for this role
  const allowedGroups = navItems.filter((group) => {
    if (!group.allowedRoles) return false;
    return group.allowedRoles.includes(role);
  });

  // Debug: log all navItems and user role using useEffect to ensure logs always run
  useEffect(() => {
    console.log('[NavMenuPermissions] User role:', role);
    console.log('[NavMenuPermissions] All navItems:', navItems);
    navItems.forEach((group) => {
      const allowed = group.allowedRoles && group.allowedRoles.includes(role);
      if (group.allowedRoles) {
        console.log(
          `[NavMenuPermissions] Group '${group.title}' allowedRoles:`,
          group.allowedRoles,
          'User role:',
          role,
          'Allowed:',
          allowed,
        );
      } else {
        console.log(`[NavMenuPermissions] Group '${group.title}' has NO allowedRoles, will NOT be shown.`);
      }
    });
    console.log(
      '[NavMenuPermissions] Allowed groups for user:',
      allowedGroups.map((g) => g.title),
    );
  }, [role, navItems]);

  return (
    <MenuList>
      {allowedGroups.map((group) =>
        group.menuChildren?.map((item) => (
          <MenuItem key={item.href} component={RouterLink} to={item.href}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.title} />
          </MenuItem>
        )),
      )}
    </MenuList>
  );
}

export default NavMenuPermissions;
