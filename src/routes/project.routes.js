import { Router } from 'express';
import {
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getAllProjects
} from '../controllers/project.controller.js';

const router = Router();

router
    .get('/',getAllProjects)
    .get('/:id', getProjectById)
    .post('', createProject)
    .put('/:id', updateProject)
    .delete('/:id', deleteProject)

export default router;