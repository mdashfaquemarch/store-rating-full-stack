import { prisma } from "../configs/index.js";
import CrudRepository from "./crud.repository.js";

class RatingRepository extends CrudRepository {
  constructor() {
    super(prisma.rating);
  }

  async findAverageRatingOfStore(storeId) {
    const rating = await prisma.rating.aggregate({
      where: { storeId: storeId },
       _avg: { rating: true }
    });
    return rating;
  }


 // Get specific user's rating for a store
async findRatingOfUser(storeId, userId) {
  console.log(storeId, userId);
  
  const rating = await prisma.rating.findFirst({
    where: {
      OR: [{
        userId,
        storeId,
      }],
    },
  });

  console.log("here", rating);
  return rating;
}

}

export default RatingRepository;
