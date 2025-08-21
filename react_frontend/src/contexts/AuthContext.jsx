import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mount → fetching profile…');
    fetch('/accounts/api/profile/', {
      credentials: 'include',
    })
      .then((res) => {
        console.log('profile API responded', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('profile data:', data);
        setUser(data.user || null);
      })
      .catch((err) => {
        console.error('profile fetch error:', err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value = React.useMemo(() => ({ user, loading }), [user, loading]);
  console.log('memoovalue==>', value);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
