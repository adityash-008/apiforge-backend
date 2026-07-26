import asyncHandler from "../utils/asyncHandler.js";
import pool from "../config/db.js";

export const getAllProjects = asyncHandler(async (req, res) => {

    const [rows] = await pool.query("SELECT * FROM projects");

    res.status(200).json(rows)

})

export const getProjectById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const [project] = await connection.pool("SELECT * FROM projects WHERE id=?", [id]);

    if (project.length === 0) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    return res.status(200).json({
        success: true,
        message: "Data fetched Successfully",
        data: project[0]
    })

})

export const createProject = asyncHandler(async (req, res) => {

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


    const [result] = await pool.query("INSERT INTO projects (title,description,status) VALUES(?,?,?)",
        [title, description, status]
    );
    return res.status(201).json({
        success: true,
        message: "Project Created Successfully",
        projectId: result.insertId
    })

})

export const updateProject = asyncHandler(async (req, res) => {

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

    const [result] = await pool.query("UPDATE projects SET title = ?,description = ?,status = ? WHERE id = ?", [title, description, status, id])
    if (result.affectedRows === 0) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    return res.status(200).json({
        success: true,
        message: "Project updated successfully",

    })

})

export const deleteProject = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({
        success: false,
        message: "Project Not Found!"
    })

    return res.status(200).json({
        success: true,
        message: "Project Deleted Successfully"
    })

})