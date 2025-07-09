import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Puedes guardar usuario en localStorage para persistir la sesión
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Guarda en localStorage cuando cambie el usuario
  React.useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
