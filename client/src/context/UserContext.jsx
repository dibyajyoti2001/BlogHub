import { createContext, useEffect, useState } from "react";
import { refetchUser, refreshUser } from "../server/api";
import { LocalStorage } from "../utils";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const token = LocalStorage.get("accessToken");

    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      const res = await refetchUser();
      setUser(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await refreshUser();
          const res = await refetchUser();
          setUser(res.data.data);
        } catch (error) {
          setUser(null);
          alert(error.message);
        }
      } else {
        setUser(null);
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
