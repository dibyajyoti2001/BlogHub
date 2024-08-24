import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function AuthLayout({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}
