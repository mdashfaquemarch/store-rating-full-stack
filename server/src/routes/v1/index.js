import express from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import ratingRoutes from './rating.route.js';
import dashboardRoutes from './dashboard.route.js';
import storeRoutes from './store.route.js'
import systemRoutes from './system.route.js'

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/rating", ratingRoutes);
router.use("/store", storeRoutes);
router.use("/system", systemRoutes)
router.use("/dashboard", dashboardRoutes)


export default router;

