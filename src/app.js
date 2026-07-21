import express from 'express';
import { projects } from './data/projects.js';

const app = express();
app.use(express.json());

//Homepage
app.get('/', (req, res) => {
    res.send("Welcome to API Forge");
})

app.get('/projects/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const data = projects.find(project => project.id === id);
    if (!data) {
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

app.post('/projects', (req, res) => {
    const projectData = req.body; //Read Data

    if(!projectData.name) return res.status(400).json({message: "Enter Required Field"})
    if(projectData.name.length<3) return res.status(400).json({message: "Minimum length is 3 "})

    const project = { //Create a object
        id: projects.length + 1,
        name: projectData.name,
        description: projectData.description,
        category: projectData.category,
        githubUrl: projectData.githubUrl,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    //Adding to array
    projects.push(project);
    //Sending a response
    return res.status(201).json({
        success: true
    })
})

app.put('/projects/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const project = projects.find(project => project.id === id);
    if(!project) return res.status(404).json({
        success:false,
        message:"Project Not Found!"
    })
    Object.assign(project,updateData);
    project.updatedAt = new Date();
    return res.status(200).json({
        success:true,
        message: "Project updated successfully",
        data:project
    })
})

app.delete('/projects/:id',(req,res)=> {
    const id = parseInt(req.params.id);
    const index = projects.findIndex(project => project.id === id);

    if(index === -1) return res.status(404).json({
        success:false,
        message:"Project Not Found!"
    })

    const deletedProject = projects[index];
    projects.splice(index,1);
    return res.status(200).json({
        success:true,
        message:"Project Deleted Successdully"
    })
})

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})