import { Router } from "express";
import {
  deleteUserDetails,
  getCurrentUser,
  loginUser,
  logoutUser,
  // refetchUser,
  refreshAccessToken,
  registerUser,
  updateUserDetails,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
// router.route("/refetch-user").get(verifyJWT, refetchUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateUserDetails);
router.route("/delete-user-details").delete(verifyJWT, deleteUserDetails);

export default router;
