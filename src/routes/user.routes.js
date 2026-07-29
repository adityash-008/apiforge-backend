import { Router } from 'express'
import {registerUser,loginUser} from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router
.post('/register',registerUser)
.post('/login',loginUser)



export default router;