import connection from "../config/db.js";

export const getAllProjects = async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM projects");

        res.status(200).json(rows)
    } catch (error) {
        console.log("ERROR: "+ error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const [project] = await connection.query("SELECT * FROM projects WHERE id=?", [id]);

        if (project.length === 0) return res.status(404).json({
            success: false,
            message: "Project Not Found!"
        })

        return res.status(200).json({
            success: true,
            message: "Data fetched Successfully",
            data: project[0]
        })
    } catch (error) {
        console.log("ERROR: " + error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const createProject = async (req, res) => {
    try {
        const projectData = req.body;
        const { title, description, status } = projectData;

        if (!title || !status) return res.status(400).json({
            success: false,
            message: "Enter required fields"
        })
        if (title.length < 3) return res.status(400).json({
            success: false,
            message: "Minimum length should be 3"
        })


        const [result] = await connection.query("INSERT INTO projects (title,description,status) VALUES(?,?,?)",
            [title, description, status]
        );
        return res.status(201).json({
            success: true,
            message: "Project Created Successfully",
            projectId: result.insertId
        })
    } catch (error) {
        console.log("ERROR: " + error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        if (!title || !status) return res.status(400).json({
            success: false,
            message: "Title and status are required"
        })
        if (title.length < 3) return res.status(400).json({
            success: false,
            message: "Minimum length should be 3"
        })

        const [result] = await connection.query("UPDATE projects SET title = ?,description = ?,status = ? WHERE id = ?", [title, description, status, id])
        if (result.affectedRows === 0) return res.status(404).json({
            success: false,
            message: "Project Not Found!"
        })

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",

        })
    } catch (error) {
        console.log("ERROR: " + error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query("DELETE FROM projects WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({
            success: false,
            message: "Project Not Found!"
        })

        return res.status(200).json({
            success: true,
            message: "Project Deleted Successfully"
        })
    } catch (error) {
        console.log("ERROR: " + error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}