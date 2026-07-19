import express from 'express';
import { projects } from './data/projects.js';

const app = express();

app.get('/',(req,res)=> {
    res.send("Welcome to API Forge");
})

app.get('/projects/:id',(req,res)=> {
    const id = parseInt(req.params.id)
    const data = projects.find(project => project.id === id);
    if(!data){
        return res.status(404).json({
            "success": false,
            "message": "Project Not Found"
        })
    }
    return res.status(200).json({
    "success": true,
    "message": "Projects fetched successfully",
    "data": data
    
})
})

app.get('/health',(req,res)=> {
    res.json({
        success: true,
        message: "APIForge server is healthy"
    })
})

const PORT = 5000

app.listen(PORT,()=> {
    console.log(`Server is running on PORT ${PORT}`);
})