import { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) setUser({ token });
    };
    loadUser();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync("userToken", token);
    console.log(token);
    setUser({ token });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
