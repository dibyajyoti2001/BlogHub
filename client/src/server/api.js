import Axios from "../Axios/Axios.js";
import { LocalStorage } from "../utils";

// Add an interceptor to set authorization header with user token before requests
Axios.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("accessToken");
    console.log("Interceptor token:", token);

    // Set authorization header with bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for different actions
// Auth routes
const loginUser = async (data) => {
  try {
    const response = await Axios.post("/auth/login", data);
    const { accessToken, refreshToken } = response.data.data;

    LocalStorage.set("accessToken", accessToken);
    LocalStorage.set("refreshToken", refreshToken);

    return response;
  } catch (error) {
    throw error;
  }
};

const registerUser = (data) => {
  return Axios.post("/auth/register", data);
};

const logoutUser = async () => {
  try {
    await Axios.post("/auth/logout");

    LocalStorage.remove("accessToken");
    LocalStorage.remove("refreshToken");
  } catch (error) {
    throw error;
  }
};

const refreshUser = async () => {
  try {
    const response = await Axios.post(
      "/auth/refresh-token",
      {},
      { withCredentials: true }
    );
    const { accessToken, refreshToken } = response.data.data;

    LocalStorage.set("accessToken", accessToken);
    LocalStorage.set("refreshToken", refreshToken);

    return response;
  } catch (error) {
    throw error;
  }
};

const refetchUser = async () => {
  try {
    return await Axios.get("/auth/refetch-user", { withCredentials: true });
  } catch (error) {
    throw error;
  }
};

const currentUser = () => {
  return Axios.get("/auth/current-user");
};

const updateUser = (data) => {
  return Axios.patch("/auth/update-account", data);
};

const deleteUser = async () => {
  try {
    await Axios.delete("/auth/delete-user-details");

    LocalStorage.remove("accessToken");
    LocalStorage.remove("refreshToken");
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

// Comment routes
const createComment = (data) => {
  return Axios.post("/comment/create", data);
};

const postComment = (postId) => {
  return Axios.get(`/comment/post-comment/${postId}`);
};

const updateComment = (data, commentId) => {
  return Axios.patch(`/comment/update-comment/${commentId}`, data);
};

const deleteComment = (commentId) => {
  return Axios.delete(`/comment/delete-comment/${commentId}`);
};

// Post routes
const createPost = (data) => {
  return Axios.post("/post/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const upload = (data) => {
  return Axios.post("/post/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getAllPosts = (searchQuery = "") => {
  return Axios.get(`/post/all-posts${searchQuery}`);
};

const getPostById = (postId) => {
  return Axios.get(`/post/specific-post/${postId}`);
};

const getUserPosts = (userId) => {
  return Axios.get(`/post/user-posts/${userId}`);
};

const updatePost = (data, postId) => {
  return Axios.patch(`/post/update-post/${postId}`, data);
};

const deletePost = (postId) => {
  return Axios.delete(`/post/delete-post/${postId}`);
};

export {
  loginUser,
  refreshUser,
  logoutUser,
  registerUser,
  refetchUser,
  currentUser,
  updateUser,
  deleteUser,
  createComment,
  updateComment,
  deleteComment,
  postComment,
  createPost,
  upload,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getUserPosts,
};
