import { projects } from "../data/projects.js";

export const getAllProjects = (req,res) => {
    const allProjects = projects;
    res.status(200).json({
        success: true,
        data: allProjects
    })
}

export const getProjectById = (req, res) => {
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
}

export const createProject = (req, res) => {
    const projectData = req.body; //Read Data

    if (!projectData.name) return res.status(400).json({ message: "Enter Required Field" })
    if (projectData.name.length < 3) return res.status(400).json({ message: "Minimum length is 3 " })

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
}

export const updateProject = (req, res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const project = projects.find(project => project.id === id);
    if (!project) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })
    Object.assign(project, updateData);

    project.updatedAt = new Date();
    return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: project
    })
}

export const deleteProject = (req, res) => {
    const id = parseInt(req.params.id);
    const index = projects.findIndex(project => project.id === id);

    if (index === -1) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    const deletedProject = projects[index];
    projects.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: "Project Deleted Successdully"
    })
}