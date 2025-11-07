import { StatusCodes } from "http-status-codes";
import { createUserService, dashboardStatsService, getAllStoresService, getAllUserService, getUserDetailsByIdService } from "../services/system.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";


// POST /api/admin/users
const createUserController = asyncHandler(async (req, res) => {
    // const { name, email, address, password, role, store } = req.body;
    const response = await createUserService(req.body);

    return res
    .status(StatusCodes.CREATED)
    .json(
        new ApiResponse(`new ${req.body.role} created successfully`, StatusCodes.CREATED, response)
    )

})

// Get list of all users (supports filter by name, email, role, etc.)

const getAllUserWithFilterController = asyncHandler(async (req, res) => {
       
      const response = await getAllUserService(req.query);

      return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse("users fetched successfully", StatusCodes.OK, 
            response
        )
      )
})

// dashboard stats

const dashboardStatsController = asyncHandler(async (req, res) => {
    const response = await dashboardStatsService();
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse("dashboard fetched successfully", StatusCodes.OK, 
            response
        )
      )
})

const getUserDetailsByIdController = asyncHandler(async (req, res) => {
    const response = await getUserDetailsByIdService();
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse("user Details fetched successfully", StatusCodes.OK, 
            response
        )
      )
})

const getAllStoresController = asyncHandler( async (req, res) => {
   const response = await getAllStoresService();
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse("all store with average rating fetched successfully", StatusCodes.OK, 
            response
        )
      )
})

export {
    createUserController,
    getAllUserWithFilterController,
    dashboardStatsController,
    getUserDetailsByIdController,
    getAllStoresController
}