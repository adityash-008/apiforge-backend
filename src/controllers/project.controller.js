import asyncHandler from "../utils/asyncHandler.js";
import pool from "../config/db.js";

export const getAllProjects = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const [projects] = await pool.query("SELECT * FROM projects WHERE user_id = ?", [userId]);

    res.status(200).json({
        success: true,
        projects
    })

})

export const getProjectById = asyncHandler(async (req, res) => {

    const user_id = req.user.id;
    const projectId = req.params.id

    const [project] = await pool.query("SELECT * FROM projects WHERE id=? AND user_id = ?", [projectId, user_id]);

    if (project.length === 0) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    return res.status(200).json({
        success: true,
        project: project[0]
    })

})

export const createProject = asyncHandler(async (req, res) => {

    const { name, description, status, github_url, live_url, category } = req.body;
    const user_id = req.user.id;

    if (!name || !status) return res.status(400).json({
        success: false,
        message: "Enter required fields"
    })

    if (name.length < 3) return res.status(400).json({
        success: false,
        message: "Minimum length should be 3"
    })

    const allowedStatus = ["Active", "Completed", "On Hold"]
    if (!allowedStatus.includes(status)) return res.status(400).json({
        success: false,
        message: "Invalid status"
    })

    const [result] = await pool.query("INSERT INTO projects (name,description,status,github_url,live_url,category,user_id) VALUES(?,?,?,?,?,?,?)",

        [name, description, status, github_url, live_url, category, user_id]
    );
    return res.status(201).json({
        success: true,
        message: "Project Created Successfully",
        projectId: result.insertId
    })

})

export const updateProject = asyncHandler(async (req, res) => {

    
    const projectId = Number(req.params.id);
    const user_id = req.user.id;
    const { name, description, status, github_url, live_url, category } = req.body;

    if (isNaN(projectId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Project ID"
        });
    }

    const updates = [];
    const values = [];

    const fields = {
        name, description, status, github_url, live_url, category
    }

    if (name && name.length < 3) return res.status(400).json({
        success: false,
        message: "Name length should be greater than 3"
    })

    const allowedStatus = ["Active", "Completed", "On Hold"];

    if (status && !allowedStatus.includes(status)) return res.status(400).json({
        success: false,
        message: "Invalid Status"
    });

    for (const key in fields) {
        if (fields[key] !== undefined && fields[key].trim() !== "") {
            updates.push(` ${key} = ?`);
            values.push(fields[key]);
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No fields to update"
        });
    }

    const updateQuery = updates.join(", ");
    const query = `UPDATE projects SET ${updateQuery} WHERE id = ? AND user_id = ?`

    values.push(projectId);
    values.push(user_id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    return res.status(200).json({
        success: true,
        message: "Project Updated Successfully",

    })

})

export const deleteProject = asyncHandler(async (req, res) => {

    const projectId = Number(req.params.id);
    const user_id = req.user.id;

    if (isNaN(projectId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Project ID"
        });
    }

    const [result] = await pool.query("DELETE FROM projects WHERE id = ? AND user_id = ?", [projectId, user_id]);

    if (result.affectedRows === 0) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    return res.status(200).json({
        success: true,
        message: "Project Deleted Successfully"
    })

})