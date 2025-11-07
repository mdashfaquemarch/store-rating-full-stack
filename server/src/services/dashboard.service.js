import RatingRepository from "../repositories/rating.repository.js";
import StoreRepository from "../repositories/store.repository.js";
import UserRepository from "../repositories/user.repository.js";


const userRepo = new UserRepository();
const storeRepo = new StoreRepository();
const ratingRepo = new RatingRepository();

const storeDashBoardService = async (user) => {
   const result = await storeRepo.findStoreWithAverageRating(user.email)
   return result;
}


const adminDashBoardService = async () => {
  const details = {};
  details.totalUsers = await userRepo.countOnly();
  details.totalStores = await storeRepo.countOnly();
  details.totalRatings = await ratingRepo.countOnly();
  return {stats: details};
}

export {
    storeDashBoardService,
    adminDashBoardService
}