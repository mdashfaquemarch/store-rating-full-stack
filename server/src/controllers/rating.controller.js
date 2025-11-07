import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { createRatingService, deleteRatingService, getAverageRatingOfStoreService, getSpecificUserRatingOfStoreService, listUserRatingOfStoreService, updateRatingService } from "../services/rating.service.js";




const createRatingController = asyncHandler(async (req, res) => {
     console.log(req.params, req.body, req.user);
    const response = await createRatingService(req.params, req.body, req.user);
    return res
    .status(StatusCodes.CREATED)
    .json(
        new ApiResponse("Rating created successfully", StatusCodes.CREATED, response)
    )
})

const updateRatingController = asyncHandler(async (req, res) => {
 const response = await updateRatingService(req.params, req.body, req.user);
    return res
    .status(StatusCodes.CREATED)
    .json(
        new ApiResponse("updated rating  successfully", StatusCodes.CREATED, response)
    )
})

const deleteRatingController = asyncHandler(async (req, res) => {
 const response = await deleteRatingService();
    return res
    .status(StatusCodes.CREATED)
    .json(
        new ApiResponse("deleted rating successfully", StatusCodes.CREATED, response)
    )
})

const listUserRatingOfStoreController = asyncHandler(async (req, res) => {
    const response = await listUserRatingOfStoreService(req.params, req.user);

    return res
    .status(StatusCodes.OK)
    .json(new ApiResponse("successfully fetched all rating of a store", StatusCodes.OK, response));
})

const getAverageRatingOfStoreController = asyncHandler( async (req, res) => {
    const response = await getAverageRatingOfStoreService(req.params)
    const result = {
         storeId: req.params.storeId,
        averageRating: response._avg.rating
    }
    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse("Average Rating fetched Successfully", StatusCodes.OK, result)
    )
})

const getSpecificUserRatingOfStoreController = asyncHandler( async (req, res) => {
    const response = await getSpecificUserRatingOfStoreService(req.params, req.user);

    return res
    .status(StatusCodes.OK)
    .json(new ApiResponse("specific User rating of a Store fetched successfully", StatusCodes.OK, response));

})

export {
    createRatingController,
    updateRatingController,
    deleteRatingController,
    listUserRatingOfStoreController,
    getAverageRatingOfStoreController,
    getSpecificUserRatingOfStoreController
}