import { StatusCodes } from "http-status-codes";
import  ApiError  from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asynchandler.util.js";
import jwt from 'jsonwebtoken'
import { Config , prisma} from "../configs/index.js";


export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError("token is required", StatusCodes.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(token, Config.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
        where: {
            email: decodedToken.email
        }
    })

    if(!user) {
        throw new ApiError("Invalid Accesss Token", StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    next();
    
  } catch (error) {
    throw new ApiError("Invalid or expired token", StatusCodes.UNAUTHORIZED);
  }
});
