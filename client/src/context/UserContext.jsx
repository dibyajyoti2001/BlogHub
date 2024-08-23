import { createContext, useEffect, useState } from "react";
import { refetchUser } from "../server/api";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await refetchUser();
      setUser(res.data.data);
    } catch (error) {
      console.error("Refetch user error:", error.response);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
