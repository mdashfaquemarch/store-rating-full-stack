import express from 'express';
import { verifyJwt } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/authorization.middleware.js';
import { Roles } from '../../utils/helper.util.js';
import { getAllStoreController, getStoreByIdController } from '../../controllers/store.controller.js';
import { getAverageRatingOfStoreController, getSpecificUserRatingOfStoreController } from '../../controllers/rating.controller.js';

const router = express.Router();



//  GET /api/stores - get All store ||  list of all registered stores
router.get("/", verifyJwt, getAllStoreController)

// GET /api/stores/:id - Get specific store details
router.get("/:id", verifyJwt , getStoreByIdController)



export default router;