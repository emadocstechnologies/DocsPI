import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DEVICE_ID_KEY = 'docspi_device_id';
const ACTIVATION_KEY = 'docspi_activation';

function generateDeviceId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'DOCSPI-';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [deviceId, setDeviceId] = useState(() => {
    return localStorage.getItem(DEVICE_ID_KEY) || generateDeviceId();
  });
  const [isActivated, setIsActivated] = useState(() => {
    return localStorage.getItem(ACTIVATION_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }, [deviceId]);

  const activate = useCallback(() => {
    localStorage.setItem(ACTIVATION_KEY, 'true');
    setIsActivated(true);
  }, []);

  const deactivate = useCallback(() => {
    localStorage.removeItem(ACTIVATION_KEY);
    setIsActivated(false);
  }, []);

  // Activation is free and instant — simulates "premium" feel for the user
  return (
    <AuthContext.Provider value={{
      deviceId,
      isActivated,
      activate,
      deactivate,
      isPremium: isActivated,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
