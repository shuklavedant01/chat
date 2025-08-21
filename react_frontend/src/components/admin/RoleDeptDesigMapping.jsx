import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext.jsx';

export default function RoleDeptDesigMapping() {
  const { user } = useUser();
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDesig, setSelectedDesig] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/accounts/api/roles/').then((res) => setRoles(res.data));
    axios.get('/accounts/api/departments/').then((res) => setDepartments(res.data));
    axios.get('/accounts/api/designations/').then((res) => setDesignations(res.data));
  }, []);

  const handleMap = () => {
    if (!selectedRole) return;
    axios
      .post(`/accounts/api/roles/${selectedRole}/map/`, {
        department_id: selectedDept || undefined,
        designation_id: selectedDesig || undefined,
      })
      .then(() => setMessage('Mapping updated!'));
  };

  if (!user?.permissions?.includes('admin_panel_access')) return null;

  return (
    <div>
      <h2>Map Role to Department/Designation</h2>
      <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole || ''}>
        <option value="">Select Role</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept}>
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedDesig(e.target.value)} value={selectedDesig}>
        <option value="">Select Designation</option>
        {designations.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={handleMap} disabled={!selectedRole}>
        Map
      </button>
      {message && <div>{message}</div>}
    </div>
  );
}
