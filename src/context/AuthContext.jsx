import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (!accessToken) {
          setShowModal(true);
          setLoading(false);
          return;
        }

        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, remember) => {
    const res = await api.post("/auth/login", {
      email,
      password,
      remember,
    });

    const { accessToken, refreshToken } = res.data;

    if (remember) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
    }

    const me = await api.get("/auth/me");
    setUser(me.data);
    setShowModal(false);
  };

 const logout = async () => {
  try {
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
  } catch (err) {
    console.error("Logout error");
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        showModal,
        setShowModal,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
