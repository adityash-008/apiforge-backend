import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import projectRouter from "./routes/project.routes.js";
import userRouter from "./routes/user.routes.js"


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

app.use(errorHandler)

export default app;

