import { prisma } from "../configs/index.js";
import CrudRepository from "./crud.repository.js";

class StoreRepository extends CrudRepository {
  constructor() {
    super(prisma.store);
  }

  async findMany() {
    const doc = await prisma.store.findMany();
    return doc;
  }

  async findAllStoresWithAverageRating() {
    const stores = await prisma.store.findMany({
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average rating per store
    const storesWithAvg = stores.map((store) => {
      const ratings = store.ratings.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        averageRating: Number(avgRating.toFixed(2)),
        ratingsCount: ratings.length,
      };
    });

    return storesWithAvg;
  }

  async findStoreWithAverageRating(email) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        store: true,
        name: true,
        email: true,
      },
    });

    const result = await prisma.store.findUnique({
      where: {
        id: user.store.id,
      },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const sumOfRatings = result.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      result._count.ratings > 0
        ? Number((sumOfRatings / result._count.ratings).toFixed(2))
        : 0;

    const finalResult = {
      id: result.id,
      name: result.name,
      address: result.address,
      owner_name: user.name,
      owner_email: user.email,
      averageRating,
      numberOfRating: result._count.ratings,
    };

    return finalResult;
  }
}

export default StoreRepository;
