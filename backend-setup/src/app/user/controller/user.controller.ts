import type { Request, Response } from "express";
import UserModel from "../models/user.schema.js";
import generateToken from "../../../utils/generateToken.js";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
import mongoIdValidate from "../../../utils/mongoIdValidate.js";
import ResponseHandler from "../../../utils/responseHandler.js";
import mongoose from "mongoose";
import type { UploadApiResponse } from "cloudinary";
import cloudinaryOptions from "../../../utils/cloudinaryManagement.js";
import { GET_ALL_BOOKINGS_BY_USER_ID_SERVICE } from "../../booking/services/booking.service.js";
import googleClient from "../../../config/googleAuth.js";
import axios from "axios";
export const USER_LOGIN_FN = async (req: Request, rs: Response) => {
  const { code } = req.body;

  if (!code) {
    return ResponseHandler(rs, 400, false, null, 'Authorization code missing"');
  }

  // 1. Exchange auth code for tokens
  const { tokens } = await googleClient.getToken(code);
  googleClient.setCredentials(tokens);

  // 2. Fetch Google user info
  const googleUserRes = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  const { email, name, picture: image , verified_email } = googleUserRes.data;


  console.log('googleUserRes.data',googleUserRes.data)

  if (!email) {
    return ResponseHandler(rs, 400, false, null, "Google account has no email");
  }

  //    const {email,name,image} = req.body;

  let isUserExist = await UserModel.findOne({ email });
  console.log('isUserExist',isUserExist);

  if (!isUserExist) {
    isUserExist = await UserModel.create({
         email, name, image,isEmailVerified:verified_email
        
        });
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const token = generateToken(
    {
      id: isUserExist._id,
      name: isUserExist.name,
      ia: isUserExist.isAdmin,
    },
    "30d"
  );
  // return res.status(200).json({
  //     success:true,
  //     token,
  //     data:null,
  //     response:'User login successfully',
  // })
  return ResponseHandler(rs, 200, true, { token,isAdmin:isUserExist.isAdmin }, "User login successfully");
};

/**
 * @desc    Get MY PROFILE BY ID
 * @route   GET /api/users/profile/:id
 * @access  Private
 * @returns  MY profile object
 */

export async function MY_PROFILE(req: AuthenticatedRequest, res: Response) {
  const id = req.user?.id;
  if (!mongoIdValidate(id)) {
    return ResponseHandler(
      res,
      401,
      true,
      null,
      "User profile fetched successfully"
    );
  }
  const user = await UserModel.findOne({
    _id: id as string,
    isDeleted: false,
  }).select("-__v -updatedAt");
  if (!user) {
    return ResponseHandler(res, 200, true, null, "User not found");
  }
  return ResponseHandler(
    res,
    200,
    true,
    user,
    "User profile fetched successfully"
  );
}

/**
 * @desc    Get USER PROFILE BY ID params
 * @route   GET /api/u-profile/:id
 * @access  Private
 * @returns  user profile object
 */

export async function GET_USER_PROFILE_BY_ID(
  req: AuthenticatedRequest,
  res: Response
) {
  const id = req.params.id;
  console.log("inside user profile", id);
  if (!mongoIdValidate(id)) {
    return ResponseHandler(
      res,
      401,
      true,
      null,
      "User profile fetched successfully"
    );
  }
  const user = await UserModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
    isDeleted: false,
  }).select("-__v -updatedAt");

  if (!user) {
    return ResponseHandler(res, 200, false, null, "User not found");
  }

  return ResponseHandler(
    res,
    200,
    true,
    user,
    "User profile fetched successfully"
  );
}

/**
 * @desc    put USER PROFILE BY ID params
 * @route   PUT /api/profile/:id
 * @access  Private
 * @returns  user profile object
 */

export async function UPDATE_USER_PROFILE_BY_ID(
  req: AuthenticatedRequest,
  res: Response
) {
  const data = req.body;
  const id = req.params.id;
  if (!mongoIdValidate(id)) {
    return ResponseHandler(
      res,
      401,
      true,
      null,
      "User profile fetched successfully"
    );
  }
  const updatingData = {
    ...(data?.name !== undefined && { name: data.name }),
    ...(data?.image !== undefined && { image: data.image }),
    ...(data?.instagram !== undefined && { instagram: data.instagram }),
    ...(data?.facebook !== undefined && { facebook: data.facebook }),
    ...(data?.linkedin !== undefined && { linkedin: data.linkedin }),
    ...(data?.bio !== undefined && { bio: data.bio }),
  };

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    updatingData,
    { new: true } // return the updated document
  ).select("-__v -updatedAt");

  if (!updatedUser) {
    return ResponseHandler(res, 200, true, null, "User not found");
  }

  const token = generateToken(
    {
      id: updatedUser._id as string,
      name: updatedUser.name,
    },
    "30d"
  );
  return ResponseHandler(
    res,
    200,
    true,
    { user: updatedUser, token },
    "User profile updated successfully"
  );
}

/**
 * @desc    put udpate user profile picture
 * @route   PUT /api/profile/pic
 * @access  Private
 * @returns  user profile object
 */

export async function UPDATE_USER_PROFILE_PIC(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const file = req.file;

  if (!file) {
    return ResponseHandler(res, 200, false, null, "File  not found");
  }
  const id = req.user?.id;
  if (!mongoIdValidate(id)) {
    return ResponseHandler(
      res,
      401,
      true,
      null,
      "Invalid user found. Please login again"
    );
  }

  const result: UploadApiResponse | undefined =
    await cloudinaryOptions.uploadItem(file.buffer, "profilePic");

  if (!result) {
    return ResponseHandler(
      res,
      200,
      false,
      null,
      "Image upload has been failed. Please try again later."
    );
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: id as string },
    {
      cloudinaryImage: {
        url: result.secure_url as string,
        publicId: result.public_id as string,
      },
    },
    { new: true } // return the updated document
  ).select("-__v -updatedAt");

  return ResponseHandler(
    res,
    200,
    true,
    updatedUser,
    "Image uploaded successfully"
  );
}

1;

//  const file = req.file;

/**
 * @desc    API CONTROLLER FUNCTION TO GET ALL USER BOOKINGS
 * @route   PUT /api/users/bookings
 * @access  Private
 * @returns  ALL BOOKINGS
 */

export async function GET_USER_ALL_BOOKINGS_CONTROLLER(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const userId = req.user?.id;
  const BookingsData = await GET_ALL_BOOKINGS_BY_USER_ID_SERVICE(userId);
  return ResponseHandler(
    res,
    200,
    true,
    BookingsData,
    "Bookings fetched successfully."
  );
}

/**
 * @desc    API CONTROLLER TO ADD FAVOURITE MOVIE
 * @route   PUT /api/users/bookings
 * @access  Private
 * @returns  ALL BOOKINGS
 */
