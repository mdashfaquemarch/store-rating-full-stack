import express from 'express';
import { logoutController, signInController, signUpController, updatePasswordController } from '../../controllers/auth.controller.js';
import { verifyJwt } from '../../middlewares/auth.middleware.js';

const router = express.Router();


router.post("/signup", signUpController);
router.post("/signin", signInController);
router.get("/logout", verifyJwt,  logoutController);
router.post("/update-password", verifyJwt, updatePasswordController);

export default router;