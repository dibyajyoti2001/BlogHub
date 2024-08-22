import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, desc, categories, photo } = req.body;
  const userId = req.user?._id;
  const username = req.user?.username;

  if (!title || !desc || !categories || !photo) {
    throw new ApiError(400, "All fields are required");
  }

  const createdPost = await Post.create({
    title,
    desc,
    username,
    userId,
    categories,
    photo,
  });

  if (!createdPost) {
    throw new ApiError(500, "Something went wrong while creating post");
  }

  return res.status(201).json(new ApiResponse(200, createdPost, "Success"));
});

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, "No file uploaded"));
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "Image has been uploaded successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { title } = req.query;
  let query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  const allPosts = await Post.find(query);

  if (!allPosts) {
    throw new ApiError(500, "Something went wrong while geting posts");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "All posts fetched successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    throw new ApiError(400, "Id not found");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Id not found");
  }

  const userPosts = await Post.find({ userId });

  if (!userPosts) {
    throw new ApiError(404, "User Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userPosts, "User posts fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { title, desc, categories, username, userId, photo } = req.body;

  if (!postId) {
    throw new ApiError(400, "Id not found");
  }

  if (!title || !desc || !categories || !username || !userId || !photo) {
    throw new ApiError(400, "All details must be required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title,
        desc,
        categories,
        username,
        userId,
        photo,
      },
    },
    { new: true }
  );

  if (!updatedPost) {
    throw new ApiError(400, "Updated post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    throw new ApiError(400, "Id not found");
  }

  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ postId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export {
  createPost,
  uploadFile,
  getAllPosts,
  getPostById,
  getUserPosts,
  deletePost,
  updatePost,
};
