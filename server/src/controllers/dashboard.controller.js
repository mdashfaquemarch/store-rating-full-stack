import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asynchandler.util.js";
import ApiResponse from "../utils/apiresponse.util.js";
import { adminDashBoardService, storeDashBoardService } from "../services/dashboard.service.js";



const storeDashBoardController = asyncHandler( async (req, res) => {
    const response = await storeDashBoardService(req.user);
    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse("store dashboard fetched successfully", StatusCodes.OK, response)
    )
})

const adminDashBoardController = asyncHandler( async (req, res) => {
 const response = await adminDashBoardService();
    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse("admin dashboard fetched successfully", StatusCodes.OK, response)
    )
})


export {
    storeDashBoardController,
    adminDashBoardController
}