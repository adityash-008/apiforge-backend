// Public API (API Key) -> FOR other devices like-mobile,CLI,other which doesn't have browser

import { Router } from "express";
import { apiKeyMiddleware } from "../middlewares/apiKey.middleware.js";
import { getAllProjects } from "../controllers/project.controller.js";

const router = Router();

router
.get('/projects',apiKeyMiddleware,getAllProjects)

export default router;