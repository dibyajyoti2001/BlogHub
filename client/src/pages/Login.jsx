import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { loginUser } from "../server/api.js";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      setUser(res.data.data.user);
      navigate("/");
    } catch (error) {
      setError(true);
      alert("Login error: " + (error.response?.data?.message || error.message));
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
        <h1 className="text-lg md:text-xl font-extrabold">
          <Link to="/">Blog Market</Link>
        </h1>
        <h3>
          <Link to="/register">Register</Link>
        </h3>
      </div>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">
            Log in to your account
          </h1>
          <input
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="w-full px-4 py-2 border-2 border-black rounded outline-0"
            type="text"
            placeholder="Enter your email"
          />
          <input
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-2 border-2 border-black rounded outline-0"
            type="password"
            placeholder="Enter your password"
          />
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg"
          >
            Log in
          </button>
          {error && (
            <h3 className="text-red-500 text-sm ">Something went wrong</h3>
          )}
          <div className="flex justify-center items-center space-x-3">
            <p>New here?</p>
            <p className="text-gray-500 hover:text-black">
              <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
