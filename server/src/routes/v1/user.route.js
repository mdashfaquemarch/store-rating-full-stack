import express from 'express';
import { verifyJwt } from '../../middlewares/auth.middleware.js';
import { getMeController } from '../../controllers/auth.controller.js';

const router = express.Router();




router.get("/me", verifyJwt, getMeController)


export default router;