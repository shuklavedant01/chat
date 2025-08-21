import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Logout() {
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally call backend logout endpoint here
    logout();
    navigate('/pages/login', { replace: true });
  }, [logout, navigate]);

  return null;
}
