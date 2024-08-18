import Axios from "../Axios/Axios.js";
import { LocalStorage } from "../utils";

// Add an interceptor to set authorization header with user token before requests
Axios.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
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
const loginUser = (data) => {
  return Axios.post("/auth/login", data);
};

const registerUser = (data) => {
  return Axios.post("/auth/register", data);
};

const logoutUser = () => {
  return Axios.post("/auth/logout");
};

const refreshUser = (data) => {
  return Axios.post("/auth/refresh-token", data);
};

const currentUser = () => {
  return Axios.get("/auth/current-user");
};

const updateUser = (data) => {
  return Axios.patch("/auth/update-account", data);
};

const deleteUser = () => {
  return Axios.delete("/auth/delete-user-details");
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
  return Axios.post("/post/create", data);
};

const getAllPosts = () => {
  return Axios.get("/post/all-posts");
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
  currentUser,
  updateUser,
  deleteUser,
  createComment,
  updateComment,
  deleteComment,
  postComment,
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getUserPosts,
};
