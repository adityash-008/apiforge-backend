import { Router } from 'express'
import {registerUser,loginUser, getCurrentUser, logoutUser} from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router
.post('/register',registerUser)
.post('/login',loginUser)
.get('/me',authMiddleware,getCurrentUser)
.get('/logout',logoutUser)


export default router;