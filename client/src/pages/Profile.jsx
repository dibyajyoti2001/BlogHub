import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import { useNavigate, useParams } from "react-router-dom";
import {
  currentUser,
  deleteUser,
  getUserPosts,
  updateUser,
} from "../server/api";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const param = useParams().id;
  const [updatedUserData, setUpdatedUserData] = useState({
    username: "",
    password: "",
    oldPassword: "",
  });
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [updated, setUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchProfile = async () => {
    try {
      const res = await currentUser();
      setUpdatedUserData((prevData) => ({
        ...prevData,
        username: res.data.data.username,
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setUpdated(false);
    try {
      const res = await updateUser(updatedUserData);
      setUpdatedUserData({
        username: "",
        password: "",
        oldPassword: "",
      });
      setUpdated(true);
    } catch (error) {
      alert(error.message);
      setUpdated(false);
    }
  };

  const handleUserDelete = async () => {
    try {
      const res = await deleteUser();
      setUser(null);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await getUserPosts(user._id);
      setPosts(res.data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [param]);

  useEffect(() => {
    fetchUserPosts();
  }, [param]);
  return (
    <div>
      <Navbar />
      <div className="min-h-[80vh] px-8 md:px-[200px] mt-8 flex md:flex-row flex-col-reverse md:items-start items-start">
        <div className="flex flex-col md:w-[70%] w-full mt-8 md:mt-0">
          <h1 className="text-xl font-bold mb-4">Your posts:</h1>
          {posts?.map((p) => (
            <ProfilePosts key={p._id} p={p} />
          ))}
        </div>
        <div className="md:sticky md:top-12  flex justify-start md:justify-end items-start md:w-[30%] w-full md:items-end ">
          <div className=" flex flex-col space-y-4 items-start">
            <h1 className="text-xl font-bold mb-4">Profile</h1>
            <input
              name="username"
              onChange={handleChange}
              value={updatedUserData.username}
              className="outline-none px-4 py-2 text-gray-500 bg-slate-100 rounded"
              placeholder="Your username"
              type="text"
            />
            <input
              name="oldPassword"
              onChange={handleChange}
              value={updatedUserData.oldPassword}
              className="outline-none px-4 py-2 text-gray-500 bg-slate-100 rounded"
              type="password"
              placeholder="Enter your current password"
            />
            <input
              name="password"
              onChange={handleChange}
              value={updatedUserData.password}
              className="outline-none px-4 py-2 text-gray-500 bg-slate-100 rounded"
              type="password"
              placeholder="Enter your password"
            />
            <div className="flex items-center space-x-4 mt-8">
              <button
                onClick={handleUserUpdate}
                className="text-white font-semibold rounded bg-black px-4 py-2 hover:text-black hover:bg-gray-400"
              >
                Update
              </button>
              <button
                onClick={handleUserDelete}
                className="text-white font-semibold rounded bg-black px-4 py-2 hover:text-black hover:bg-gray-400"
              >
                Delete
              </button>
            </div>
            {updated && (
              <h3 className="text-green-500 text-sm text-center mt-4">
                user updated successfully!
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
