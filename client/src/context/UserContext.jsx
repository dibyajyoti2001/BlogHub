import { createContext, useEffect, useState } from "react";
import { refetchUser, refreshUser } from "../server/api";
import { LocalStorage } from "../utils";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

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
        } catch (refreshErr) {
          setUser(null);
          alert("Session expired, please log in again");
        }
      } else {
        setUser(null);
        alert("An error occurred while fetching user data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
