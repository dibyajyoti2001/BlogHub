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
    console.log("Token retrieved from local storage:", token);

    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      const res = await refetchUser();
      console.log("User refetched successfully:", res.data.data);
      setUser(res.data.data);
    } catch (err) {
      console.error("Error refetching user:", err.response || err.message);

      if (err.response?.status === 401) {
        try {
          console.log("Attempting to refresh token...");
          await refreshUser();
          const res = await refetchUser();
          console.log(
            "User refetched successfully after refresh:",
            res.data.data
          );
          setUser(res.data.data);
        } catch (err) {
          console.error(
            "Error after token refresh:",
            err.response || err.message
          );
          setUser(null);
          alert("User not found after refresh");
        }
      } else {
        setUser(null);
        alert("User not found");
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
