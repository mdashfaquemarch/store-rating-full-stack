import { StatusCodes } from "http-status-codes";
import UserRepository from "../repositories/user.repository.js"
import  ApiError  from "../utils/ApiError.util.js";
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from "../utils/helper.util.js";

const userRepo = new UserRepository();

const signupService = async (data) => {
    // hashed password 
    const hashPass = hashPassword(data.password);

    const user = await userRepo.create(
        {
            data: {
                name: data.name,
                email: data.email,
                password: hashPass,
                address: data.address
            }
        }
    )

    const createdUser = await userRepo.findById({
        where: {
            email: user.email
        }
    });

    return createdUser;
}

const loginService = async (data) => {
    const { email, password } = data;

    const userExist = await userRepo.findById({
        where: {
            email: email
        }
    })

    if (!userExist) {
        throw new ApiError("user with this email not exist", StatusCodes.NOT_FOUND);
    }

    const isPasswordValid = comparePassword(userExist.password, password);

    if (isPasswordValid === false) {
        throw new ApiError("user credentials is incorrect", StatusCodes.BAD_REQUEST);
    }

    const accessToken = generateAccessToken({ id: userExist.id, email: userExist.email, role: userExist.role });
    const refreshToken = generateRefreshToken({ id: userExist.id, email: userExist.email, role: userExist.role });

    const updatedUser = await userRepo.update(
        {
            where: {
                email: userExist.email
            },
            data: {
                refreshToken: refreshToken
            },
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                role: true
            }
        }
    )


    return { updatedUser, accessToken, refreshToken };
}

const logoutService = async () => {
   
}

const updatePasswordService = async (data, userEmail) => {
    const {oldPassword, newPassword} = data;
    
    const user = await userRepo.findById({
        where: {
            email: userEmail
        }
    })

    if(!user) {
        throw new ApiError("user not found", StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = comparePassword(user.password, oldPassword);

    if(!isValidPassword) {
        throw new ApiError("old password is invalid or incorrect", StatusCodes.BAD_REQUEST);
    }

    const hashPass = hashPassword(newPassword);

    const updatedUser = await userRepo.update({
        where: {
            email: userEmail
        },
        data: {
            password: hashPass
        },
        select: {
                id: true,
                email: true,
                name: true,
                address: true
            }
    })

    return updatedUser;
}


export {
    signupService,
    loginService,
    logoutService,
    updatePasswordService
}
