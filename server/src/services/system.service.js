import { StatusCodes } from "http-status-codes";
import RatingRepository from "../repositories/rating.repository.js";
import StoreRepository from "../repositories/store.repository.js";
import UserRepository from "../repositories/user.repository.js";
import  ApiError  from "../utils/ApiError.js";
import { hashPassword, Roles } from "../utils/helper.util.js";

const userRepo = new UserRepository();
const storeRepo = new StoreRepository();
const ratingRepo = new RatingRepository();

const createUserService = async (data) => {
  const { name, email, address, password, role, store } = data;

  const hashpass = hashPassword(password);

  // checking existing user with email

  const existingUser = await userRepo.findById({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      "user already exist with email",
      StatusCodes.BAD_REQUEST
    );
  }

  // check if user role is an store owner must provide details of store

  if (role === Roles.STORE_OWNER && !store) {
    throw new ApiError(
      "store details must required if role is store owner!",
      StatusCodes.BAD_REQUEST
    );
  }

  // create user when role is admin || user
  let newUser;
  if (role === Roles.NORMAL_USER || role === Roles.SYSTEM_ADMIN) {
    newUser = await userRepo.create({
      data: {
        name: name,
        email: email,
        address: address,
        password: hashpass,
        role: role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });
  }

  if (role === Roles.STORE_OWNER && store) {
    //  create new user for store owner
    newUser = await userRepo.create({
      data: {
        name: name,
        email: email,
        address: address,
        password: hashpass,
        role: role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    // creating store
    await storeRepo.create({
      data: {
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: newUser.id,
      },
    });
  }

  return newUser;
};

const getAllUserService = async (data) => {
  const { name, email, address, role, p } = data;
  const page = Math.max(Number(p) || 1, 1); // ensure page >= 1
  const pageLimit = 10;
  const skipPage = (page - 1) * pageLimit;

  const where = {};

  const orFilters = [];
  if (name) orFilters.push({ name: { contains: name, mode: "insensitive" } });
  if (email)
    orFilters.push({ email: { contains: email, mode: "insensitive" } });
  if (address)
    orFilters.push({ address: { contains: address, mode: "insensitive" } });

  if (orFilters.length > 0) where.OR = orFilters;

  // Optional role filter (include all roles if not provided)
  if (role) {
    where.role = role;
  }

  // Fetch users with pagination
  const [users, totalUsers] = await Promise.all([
    userRepo.findAll({
      where,
      skip: skipPage,
      take: pageLimit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    }),
    userRepo.count({ where }),
  ]);

  const totalPages = Math.ceil(totalUsers / pageLimit);

  return {

    users,
    pagination: {
      totaluser: totalUsers,
      page,
      totalPages,
      limit: pageLimit,
    },
  };
};

const getUserDetailsByIdService = async () => {};

const dashboardStatsService = async () => {
  const details = {};
  details.totalUsers = await userRepo.countOnly();
  details.totalStores = await storeRepo.countOnly();
  details.totalRatings = await ratingRepo.countOnly();
  return details;
};

const getAllStoresService = async () => {
    const storesWithAvgRating = await storeRepo.findAllStoresWithAverageRating();

    return storesWithAvgRating;

    
}
export {
  createUserService,
  getAllUserService,
  dashboardStatsService,
  getUserDetailsByIdService,
  getAllStoresService
};
