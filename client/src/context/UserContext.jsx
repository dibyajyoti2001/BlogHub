import { createContext, useEffect, useState } from "react";
import { refetchUser, refreshUser } from "../server/api";
import { LocalStorage } from "../utils";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = LocalStorage.get("accessToken");

    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      const res = await refetchUser();
      setUser(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await refreshUser();
          const res = await refetchUser();
          setUser(res.data.data);
        } catch (err) {
          setUser(null);
          alert("User not found when refresh");
        }
      } else {
        setUser(null);
        navigate("/login");
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
