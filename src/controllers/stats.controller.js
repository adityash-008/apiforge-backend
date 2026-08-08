import pool from "../config/db.js"
import asyncHandler from "../utils/asyncHandler.js"

export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [projectCount] = await pool.query("SELECT COUNT(*) AS totalProjects FROM projects WHERE user_id = ?", [userId]);

    const totalProjects = projectCount[0].totalProjects

    const [apiKeyStatus] = await pool.query("SELECT is_active FROM api_keys WHERE user_id = ?", [userId]);

    const totalApiKeys = apiKeyStatus.length;

    let activeApiKeys = 0, revokedApiKeys = 0;
    for (const apiKey of apiKeyStatus) {
        if (apiKey.is_active) activeApiKeys++;
        else revokedApiKeys++;
    }


    return res.status(200).json({
        success: true,
        stats: {
            totalProjects: totalProjects,
            totalApiKeys: totalApiKeys,
            activeApiKeys: activeApiKeys,
            revokedApiKeys: revokedApiKeys
        }
    })
})