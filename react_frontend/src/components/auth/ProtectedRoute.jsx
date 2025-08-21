import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Page403 from '../../pages/errorPages/403';

export default function ProtectedRoute({ element: Element, allowedRoles = [], allowedPermissions = [] }) {
  const { user } = useContext(AuthContext);
  console.log('[ProtectedRoute] User:', user);
  // Not logged in → redirect to login
  if (!user || !user.role) {
    return <Navigate to="/pages/login" replace />;
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Page403 />;
  }

  // Permission check (once you add permissions to user.session)
  if (allowedPermissions.length > 0 && !allowedPermissions.every((perm) => user.permissions?.includes(perm))) {
    return <Page403 />;
  }

  // All good
  return <Element />;
}
