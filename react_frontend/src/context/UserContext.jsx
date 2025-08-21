import { createContext, useContext, useState, useMemo, useEffect } from 'react';

// UserContext will hold user info and permissions in memory
const UserContext = createContext();
console.log('UserContext created', UserContext);

export function UserProvider({ children }) {
  console.log('[UserProvider] rendered');
  const [user, setUser] = useState(null); // { username, role, department, designation, permissions }

  // Helper to fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch('/accounts/api/profile/', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        console.log('[UserProvider] profile_api response:', data);
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('[UserProvider] profile_api error:', err);
      setUser(null);
    }
  };

  // On mount, fetch user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  // Persist user to localStorage on change
  useEffect(() => {
    console.log('[UserProvider] user state changed:', user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Call this after login
  const login = (userData) => {
    console.log('[UserProvider] login called with:', userData);
    setUser(userData);
    // Immediately refresh user from backend to get correct role/menu
    fetchProfile();
  };

  // Call this on logout
  const logout = () => {
    console.log('[UserProvider] logout called');
    setUser(null);
    localStorage.removeItem('user');
  };

  // Call this if user/permissions change (e.g., after role/permission update)
  const updateUser = (newUserData) => {
    console.log('[UserProvider] updateUser called with:', newUserData);
    setUser(newUserData);
  };

  const contextValue = useMemo(() => {
    console.log('[UserProvider] contextValue recalculated:', { user });
    return { user, login, logout, updateUser };
  }, [user]);
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
