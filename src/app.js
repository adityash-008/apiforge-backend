import express from 'express';
import errorHandler from './middlewares/errorHandler.js';

import projectRouter from "./routes/project.routes.js";


const app = express();
app.use(express.json());

//Homepage
app.get('/', (req, res) => {
    res.send("Welcome to API Forge");
})

app.use('/projects', projectRouter)

app.use(errorHandler)

export default app;

