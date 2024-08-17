import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getPostComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createComment);
router.route("/post-comment/:id").get(getPostComment);
router.route("/update-comment/:id").patch(verifyJWT, updateComment);
router.route("/delete-comment/:id").delete(verifyJWT, deleteComment);

export default router;
