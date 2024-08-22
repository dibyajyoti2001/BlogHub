import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, email, password } = req.body;

  // validate user details - not empty
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields must be required");
  } else if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email address");
  }

  // check if user already exist - username and email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // create user object - create entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  // remove password, refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // return response
  return res.status(201).json(new ApiResponse(200, createdUser, "Success"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details from req.body
  const { email, password } = req.body;

  // check username or email
  if (!email) {
    throw new ApiError(404, "email required");
  }

  // find user is registered or not
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  // generate access & refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send to user by cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Find the user id and undefined the user token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get the token from frontend using cookies
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // validate if have incomingRefreshToken or not
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // verify token in decoded form
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // find the user by using decodedToken id
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // validate the incomingRefreshToken and user saved refresh token
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // generate refresh token
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // send to user by cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("newRefreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// const refetchUser = asyncHandler(async (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (!token) {
//     throw new ApiError(400, "Token missing");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

//     const user = await User.findById(decoded._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(404, "User not found");
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, user, "User refetched successfully"));
//   } catch (error) {
//     throw new ApiError(401, error.message || "Invalid or expired token");
//   }
// });

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(201)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  // Get the user data to update
  const { username, password, oldPassword } = req.body;

  // Validate input
  if (!username || !password || !oldPassword) {
    throw new ApiError(400, "All fields are required");
  }

  // Find user by ID
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate the old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid current password");
  }

  user.username = username;
  user.password = password;
  await user.save({ validateBeforeSave: false });

  const updatedUser = user.toObject();
  delete updatedUser.password;

  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account updated successfully"));
});

const deleteUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete the user from the User collection
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  // Delete related data from other collections
  await Post.deleteMany({ userId });
  await Comment.deleteMany({ userId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "User and related data deleted successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  // refetchUser,
  getCurrentUser,
  updateUserDetails,
  deleteUserDetails,
};
