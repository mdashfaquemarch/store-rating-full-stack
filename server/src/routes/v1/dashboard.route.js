
/*
Dashboard/Statistics APIs

GET /api/dashboard/admin - Admin dashboard stats (total users, stores, ratings)
GET /api/dashboard/store-owner - Store owner dashboard (average rating, user ratings list)

Additional Helper APIs

GET /api/stores/:storeId/average-rating - Get average rating for a store
GET /api/stores/:storeId/user-rating/:userId - Get specific user's rating for a store

*/

import express from 'express';
import { verifyJwt } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/authorization.middleware.js';
import { Roles } from '../../utils/helper.util.js';
import { adminDashBoardController, storeDashBoardController } from '../../controllers/dashboard.controller.js';

const router = express.Router();



router.get("/admin", verifyJwt, authorizeRoles(Roles.SYSTEM_ADMIN), adminDashBoardController)

router.get("/store", verifyJwt, authorizeRoles(Roles.STORE_OWNER), storeDashBoardController)





export default router;