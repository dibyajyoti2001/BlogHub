import { createContext, useEffect, useState } from "react";
import { refetchUser, refreshUser } from "../server/api";
import { LocalStorage } from "../utils";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = LocalStorage.get("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await refetchUser();
      setUser(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token might be expired; try refreshing
        try {
          await refreshUser();
          const res = await refetchUser();
          setUser(res.data.data);
        } catch (refreshErr) {
          console.error("Refetch user error:", refreshErr);
          setUser(null);
          setError("Session expired, please log in again.");
        }
      } else {
        console.error("Refetch user error:", err);
        setUser(null);
        setError("An error occurred while fetching user data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, setUser, setLoading, setError }}
    >
      {children}
    </UserContext.Provider>
  );
}
