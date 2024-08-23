import { createContext, useEffect, useState } from "react";
import { refetchUser } from "../server/api";
import { LocalStorage } from "../utils";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = LocalStorage.get("accessToken");
    console.log("Token being sent:", token); // Should print the token

    try {
      const res = await refetchUser(); // This request will use the token in the interceptor
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
