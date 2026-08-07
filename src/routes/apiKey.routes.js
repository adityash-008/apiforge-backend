import { Router } from 'express';
import { generateApiKey, getAllApiKeys, revokeApiKey, activateApiKey} from "../controllers/apiKey.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';



const router = Router();

router
    .post('/generate', authMiddleware, generateApiKey)
    .get('/', authMiddleware, getAllApiKeys)
    .patch('/:id/revoke', authMiddleware, revokeApiKey)
    .patch('/:id/activate',authMiddleware, activateApiKey)

export default router;
