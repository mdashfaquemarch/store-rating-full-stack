import express from 'express';
import { createUserController, dashboardStatsController, getAllStoresController, getAllUserWithFilterController, getUserDetailsByIdController } from '../../controllers/system.controller.js';
import { verifyJwt } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/authorization.middleware.js';
import { Roles } from '../../utils/helper.util.js';


const router = express.Router();


// this route will create normal user || store || admin
router.post("/", verifyJwt, authorizeRoles(Roles.SYSTEM_ADMIN), createUserController);

// List all user + filter users -> Name, Email, Address , role

router.get("/user", verifyJwt, authorizeRoles(Roles.SYSTEM_ADMIN), getAllUserWithFilterController);

// list all store with their average ratings
router.get("/store", verifyJwt, getAllStoresController)

// Get specific user details (with store rating if STORE_OWNER)
router.get("/:id", verifyJwt, authorizeRoles(Roles.SYSTEM_ADMIN), getUserDetailsByIdController)


export default router;