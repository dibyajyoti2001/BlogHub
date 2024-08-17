import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.js";

const router = Router();

router.route("/create").post(upload.single("photo"), verifyJWT, createPost);
router.route("/all-posts").get(getAllPosts);
router.route("/specific-post/:id").get(getPostById);
router.route("/user-posts/:id").get(verifyJWT, getUserPosts);
router
  .route("/update-post/:id")
  .patch(upload.single("photo"), verifyJWT, updatePost);
router.route("/delete-post/:id").delete(verifyJWT, deletePost);

export default router;
