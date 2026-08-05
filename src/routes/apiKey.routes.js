import { Router } from 'express';
import { generateApiKey } from '../controllers/generateApiKey.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';



const router = Router();

router
.post('/generate',authMiddleware,generateApiKey)


export default router;
