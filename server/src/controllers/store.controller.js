import { StatusCodes } from "http-status-codes";
import { fetchUserlistOfRatingService, getAllStoreService, getStoreByIdService} from "../services/store.service.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";






const fetchUserlistOfRatingController = asyncHandler(async (req, res) => {
    const response = await fetchUserlistOfRatingService(req.user);
     return res
    .status(StatusCodes.OK)
    .json(new ApiResponse("store users with rating fetched successfully", StatusCodes.OK, response))
})

const getStoreByIdController = asyncHandler(async (req, res) => {
     const response = await getStoreByIdService(req.params);
     return res
    .status(StatusCodes.OK)
    .json(new ApiResponse("store by ID fetched successfully", StatusCodes.OK, response))
})

const getAllStoreController = asyncHandler(async (req, res) => {
    const response = await getAllStoreService();
     return res
    .status(StatusCodes.OK)
    .json(new ApiResponse("all stores fetched successfully", StatusCodes.OK, response))
})


export {
    
    fetchUserlistOfRatingController,
    getStoreByIdController,
    getAllStoreController
}