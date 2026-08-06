import { Router } from 'express';
import { generateApiKey, getAllApiKeys } from "../controllers/apiKey.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';



const router = Router();

router
    .post('/generate', authMiddleware, generateApiKey)
    .get('/', authMiddleware, getAllApiKeys)

export default router;
