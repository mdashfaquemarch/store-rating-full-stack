import express from 'express';
import { createRatingController, deleteRatingController, getAverageRatingOfStoreController, getSpecificUserRatingOfStoreController, listUserRatingOfStoreController, updateRatingController } from '../../controllers/rating.controller.js';
import {verifyJwt} from '../../middlewares/auth.middleware.js'
import { authorizeRoles } from '../../middlewares/authorization.middleware.js';
import { Roles } from '../../utils/helper.util.js';

const router = express.Router();

/*




GET /api/stores/:storeId/ratings - Get ratings for store owner's dashboard

*/


// POST /api/ratings - Submit a rating and Update/modify for store
router.post("/store/:storeId", verifyJwt, createRatingController);

// GET /api/ratings/store/ - Get all users ratings for a specific store
router.get("/store", verifyJwt ,authorizeRoles(Roles.STORE_OWNER), listUserRatingOfStoreController);

// GET /api/stores/:storeId/average-rating - Get average rating for a store

router.get("/:storeId/average-rating", verifyJwt, getAverageRatingOfStoreController)

// GET /api/v1/rating/:storeId/user - Get user rating for a store 

router.get("/:storeId/user-rating", verifyJwt, getSpecificUserRatingOfStoreController)

export default router;