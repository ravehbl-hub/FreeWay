// AuthContext: keeps the logged-in user + token for the whole app (no prop drilling).
// Any component can call useAuth() to get { user, login, register, logout, ... }.
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, loginUser, loginWithGoogleToken, registerUser } from '../api/auth.api.js';
import { getToken, saveToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check a saved token on startup

  // On first load: if a token is saved, ask the server who we are
  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchMe();
        setUser(data.user);
      } catch {
        saveToken(null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // The API client fires this event when the server answers 401 (token expired)
  useEffect(() => {
    function handleUnauthorized() {
      saveToken(null);
      setUser(null);
    }
    window.addEventListener('freeway:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('freeway:unauthorized', handleUnauthorized);
  }, []);

  async function login(email, password) {
    const data = await loginUser({ email: email, password: password });
    saveToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await registerUser({ name: name, email: email, password: password });
    saveToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function loginWithGoogle(credential) {
    const data = await loginWithGoogleToken(credential);
    saveToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    saveToken(null);
    setUser(null);
  }

  const value = {
    user: user,
    loading: loading,
    isAdmin: user ? user.role === 'admin' : false,
    login: login,
    register: register,
    loginWithGoogle: loginWithGoogle,
    logout: logout,
    setUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
