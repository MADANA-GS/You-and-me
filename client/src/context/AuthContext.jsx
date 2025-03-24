import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    id: null,
  });
  const [authPop, setAuthPop] = useState(false);
  const [navmemories, setNavMemories] = useState([]);
  const [moodsResponse, setMoodsResponse] = useState([]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        authPop,
        setAuthPop,
        navmemories,
        setNavMemories,
        moodsResponse,
        setMoodsResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
