import { StatusCodes } from "http-status-codes";
import RatingRepository from "../repositories/rating.repository.js";
import  ApiError  from "../utils/ApiError.js";
import { prisma } from "../configs/database.config.js";

const ratingRepo = new RatingRepository();

const createRatingService = async (params, data, user) => {
  const {storeId} = params;
  const { rating } = data;
  if (!rating || rating < 1 || rating > 5) {
      throw new ApiError("Rating must be between 1 and 5.", StatusCodes.BAD_REQUEST);
    }

    // Create or update rating
    const newOrUpdatedRating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId,
        },
      },
      update: {
        rating,
      },
      create: {
        rating,
        userId: user.id,
        storeId,
      },
    });


  return newOrUpdatedRating;
};

const updateRatingService = async (params, data, user) => {
  const { id } = params;
  const { rating } = data;
  const userRating = Number(rating);

  const updatedRating = await ratingRepo.update({
    where: {
      id: id,
    },
    data: {
      rating: userRating,
    },
  });

  return updatedRating;
};

const deleteRatingService = async (data) => {
  const { id } = data;
  const deletedRating = await ratingRepo.destroy({
    where: {
      id: id,
    },
  });

  return deletedRating;
};

const listUserRatingOfStoreService = async (params, user) => {
  // const {storeId} = params;

  const store = await prisma.store.findUnique({
    where: {
      ownerId: user.id,
    },
  });

  const usersRating = await prisma.rating.findMany({
    where: {
        storeId: store.id
    },
    include: {
        user: {
            select: {
                email: true,
                name: true
            }
        },
    }
  });

  console.log("userRatings ,", usersRating);

  return usersRating;
};

const getAverageRatingOfStoreService = async (params) => {
  const { storeId } = params;

  const averageRating = await ratingRepo.findAverageRatingOfStore(storeId);
  console.log(averageRating);
  return averageRating;
};

const getSpecificUserRatingOfStoreService = async (params,user) => {
  const { storeId } = params;
   console.log(storeId)
  const userRating = await ratingRepo.findRatingOfUser(storeId, user.id);

  const result = {
    storeId,
    userRating,
  };

  return result;
};

export {
  createRatingService,
  updateRatingService,
  deleteRatingService,
  listUserRatingOfStoreService,
  getAverageRatingOfStoreService,
  getSpecificUserRatingOfStoreService,
};
