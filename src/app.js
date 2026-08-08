import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import projectRouter from "./routes/project.routes.js";
import userRouter from "./routes/user.routes.js"
import apiKeyRouter from "./routes/apiKey.routes.js"
import apiRouter from "./routes/api.routes.js"
import statsRouter from "./routes/stats.routes.js"

const app = express();
app.use(express.json());
app.use(cookieParser())

//Homepage
app.get('/', (req, res) => {
    res.send("Welcome to API Forge");
})
//Project Routes
app.use('/projects', projectRouter)

//User Routes
app.use('/api/users',userRouter)

//API-Key Routes
app.use('/api/api-keys', apiKeyRouter);

//API Routes
app.use('/api/v1',apiRouter)

//Stats Routes
app.use('/api/stats',statsRouter)

app.use(errorHandler)

export default app;

