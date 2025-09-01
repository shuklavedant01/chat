import React, { useEffect, useState } from 'react';
import RoleDeptDesigMapping from '../components/admin/RoleDeptDesigMapping';
import NavMenuPermissions from '../components/navbar/navLinks/NavMenuPermissions';
import { useUser } from '../context/UserContext.jsx';
import axios from 'axios';

export default function AdminPanel() {
  const { user } = useUser();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [rolePerms, setRolePerms] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/accounts/api/roles/').then((res) => setRoles(res.data));
    axios.get('/accounts/api/permissions/').then((res) => setPermissions(res.data));
  }, []);

  useEffect(() => {
    if (selectedRole) {
      axios.get(`/accounts/api/roles/${selectedRole}/permissions/`).then((res) => setRolePerms(res.data));
    } else {
      setRolePerms([]);
    }
  }, [selectedRole]);

  const handlePermToggle = (permId) => {
    if (!selectedRole) return;
    const hasPerm = rolePerms.includes(permId);
    axios
      .post(`/accounts/api/roles/${selectedRole}/permissions/`, {
        permission_id: permId,
        action: hasPerm ? 'remove' : 'add',
      })
      .then(() => {
        setMessage('Permissions updated!');
        axios.get(`/accounts/api/roles/${selectedRole}/permissions/`).then((res) => setRolePerms(res.data));
      });
  };

  if (!user?.permissions?.includes('admin_panel_access')) return <div>Access Denied</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <NavMenuPermissions />
      <RoleDeptDesigMapping />
      <div style={{ marginTop: 32 }}>
        <h2>Assign/Unassign Permissions to Role</h2>
        <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {selectedRole && (
          <div style={{ marginTop: 16 }}>
            {permissions.map((perm) => (
              <label key={perm.id} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={rolePerms.includes(perm.id)}
                  onChange={() => handlePermToggle(perm.id)}
                />
                {perm.code} - {perm.description}
              </label>
            ))}
          </div>
        )}
        {message && <div>{message}</div>}
      </div>
    </div>
  );
}
