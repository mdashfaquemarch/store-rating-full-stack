import { prisma } from "../configs/database.config.js";
import { Config } from "../configs/server.config.js";
import { loginService, signupService, updatePasswordService } from "../services/auth.service.js";
import { ApiError } from "../utils/apierror.util.js";
import ApiResponse from "../utils/apiresponse.util.js";
import {asyncHandler} from "../utils/asynchandler.util.js";
import { StatusCodes } from "http-status-codes";

const signUpController = asyncHandler(async (req, res) => {
  // const {name, email, passwod, address} = req.body;
    console.log("response signup", req.body);

    if(req.body.role) {
      throw new ApiError("You are not allowed to select role", StatusCodes.UNAUTHORIZED);
    }

  const response = await signupService(req.body);

  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse("user created successfully", StatusCodes.CREATED));
});

const signInController = asyncHandler(async (req, res) => {
  //  const {email, password} = req.body;

  const { updatedUser, accessToken, refreshToken } = await loginService(
    req.body
  );

  const option = {
    httpOnly: Config.NODE_ENV === "production",
    secure: true,
    sameSite: "lax"
  };

  return res
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .status(StatusCodes.OK)
    .json(
      new ApiResponse("user loggedIn successfully", StatusCodes.OK, updatedUser)
    );
});

const logoutController = asyncHandler(async (req, res) => {
   const user = await prisma.user.update(
    {
      where: {
        email: req.user.email
      },
      data: {
        refreshToken: null
      }
    }
   )

   if(!user) {
    throw new ApiError("user not exists ", StatusCodes.NOT_FOUND);
   }
   const option = {
    httpOnly: Config.NODE_ENV === "production",
    secure: true,
    sameSite: "lax"
  };
   return res
   .cookie("accessToken","", option)
   .cookie("refreshToken","", option)
   .status(StatusCodes.OK)
   .json(
    new ApiResponse("user logged out successfully", StatusCodes.OK)
   )
});

const updatePasswordController = asyncHandler(async (req, res) => {
    const {oldpassword, newPassword} = req.body;

    if(oldpassword === newPassword) {
      throw new ApiError("both password are same", StatusCodes.BAD_REQUEST);
    }

    const response = await updatePasswordService(req.body, req.user.email);

    return res.
    status(StatusCodes.OK)
    .json(new ApiResponse("user password updated successfully", StatusCodes.OK, response))
});


const getMeController = asyncHandler (async (req, res) => {
   const user = await prisma.user.findUnique(
     {
      where: {
         id: req.user.id
      }
     }
   )

   return res
   .status(StatusCodes.OK)
   .json(new ApiResponse("user fetched successfully", StatusCodes.OK, user));
})

export {
  signUpController,
  signInController,
  logoutController,
  updatePasswordController,
  getMeController
};
