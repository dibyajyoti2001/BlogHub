import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../server/api";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      setError(false);
      navigate("/login");
    } catch (error) {
      setError(true);
      alert("Registration error: " + error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
        <h1 className="text-lg md:text-xl font-extrabold">
          <Link to="/">Blog Market</Link>
        </h1>
        <h3>
          <Link to="/login">Login</Link>
        </h3>
      </div>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Create an account</h1>
          <input
            name="username"
            onChange={handleChange}
            value={formData.username}
            className="w-full px-4 py-2 border-2 rounded border-black outline-0"
            type="text"
            placeholder="Enter your username"
          />
          <input
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="w-full px-4 py-2 border-2 rounded border-black outline-0"
            type="text"
            placeholder="Enter your email"
          />
          <input
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-2 border-2 rounded border-black outline-0"
            type="password"
            placeholder="Enter your password"
          />
          <button
            type="submit"
            onClick={handleRegister}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg"
          >
            Register
          </button>
          {error && (
            <h3 className="text-red-500 text-sm ">Something went wrong</h3>
          )}
          <div className="flex justify-center items-center space-x-3">
            <p>Already have an account?</p>
            <p className="text-gray-500 hover:text-black">
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
