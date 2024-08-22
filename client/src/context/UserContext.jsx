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
      alert(error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
