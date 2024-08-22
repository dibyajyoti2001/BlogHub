import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const createComment = asyncHandler(async (req, res) => {
  const { comment, postId } = req.body;
  const author = req.user?.username;
  const userId = req.user?._id;

  if (!comment || !author || !postId || !userId) {
    throw new ApiError(400, "All fields are required");
  }

  const createdComment = await Comment.create({
    comment,
    author,
    userId,
    postId,
  });

  if (!createdComment) {
    throw new ApiError(500, "Something went wrong while creating post");
  }

  return res.status(201).json(new ApiResponse(200, createdComment, "Success"));
});

const getPostComment = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    throw new ApiError(400, "Id not found");
  }

  const postComment = await Comment.find({ postId });

  if (!postComment) {
    throw new ApiError(404, "Post comments not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, postComment, "Post Comments fetched successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { comment, author, userId, postId } = req.body;

  if (!comment || !author || !userId || !postId) {
    throw new ApiError(400, "All details must be required");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        comment,
        author,
        userId,
        postId,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Updated post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createComment, updateComment, deleteComment, getPostComment };
