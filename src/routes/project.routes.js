import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getAllProjects
} from '../controllers/project.controller.js';

const router = Router();

router
    .get('/', authMiddleware, getAllProjects)
    .get('/:id', authMiddleware, getProjectById)
    .post('', authMiddleware, createProject)
    .patch('/:id',authMiddleware, updateProject)
    .delete('/:id',authMiddleware, deleteProject)

export default router;