import { createContext, useEffect, useState } from "react";
import { refetchUser } from "../server/api";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = LocalStorage.get("token");
    console.log("Token being sent:", token);
    try {
      const res = await refetchUser();
      setUser(res.data.data);
    } catch (error) {
      console.error("Refetch user error:", error);
      alert(error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
