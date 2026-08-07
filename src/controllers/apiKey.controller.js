import crypto, { subtle } from 'crypto'
import asyncHandler from '../utils/asyncHandler.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt'

export const generateApiKey = asyncHandler(async (req, res) => {

    const user_id = req.user.id;

    const { name } = req.body;

    if (!name || !name.trim()) return res.status(400).json({
        success: false,
        message: "API Key name is required"
    });


    const API_KEY_PREFIX = "apf";

    const publicPrefix = crypto.randomBytes(4).toString("hex");

    const secret = crypto.randomBytes(32).toString("hex")

    const apiKey = `${API_KEY_PREFIX}_${publicPrefix}.${secret}`;

    const secretHash = await bcrypt.hash(secret, 10);

    const [result] = await pool.query("INSERT INTO api_keys(name,key_prefix,key_hash,user_id) VALUES(?,?,?,?)", [name.trim(), publicPrefix, secretHash, user_id])

    return res.status(201).json({
        success: true,
        message: "API Key Generated Successfully",
        apiKey
    });
})

export const getAllApiKeys = asyncHandler(async (req, res) => {
    const user_id = req.user.id;

    const [apiKeys] = await pool.query("SELECT id,name,key_prefix,is_active,last_used_at,created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC", [user_id])

    return res.status(200).json({
        success: true,
        apiKeys
    })
})

export const revokeApiKey = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const apiId = Number(req.params.id);

    if (!Number.isInteger(apiId) || apiId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid API Key ID"
        });
    }

    //Check api exists and is_active status = false
    const [apiKey] = await pool.query("SELECT is_active FROM api_keys WHERE id = ? AND user_id = ?", [apiId, userId]);

    if (apiKey.length === 0) return res.status(404).json({
        success: false,
        message: "API Key Not Found"
    })

    if (!apiKey[0].is_active) return res.status(409).json({
        success: false,
        message: "API key is already revoked"
    })

    await pool.query("UPDATE api_keys SET is_active = false WHERE id = ?", [apiId])

    return res.status(200).json({
        success: true,
        message: "API key revoked successfully"
    })
})

export const activateApiKey = asyncHandler(async (req,res) => {
    const apiId = Number(req.params.id);
    const userId = req.user.id;

    if(!Number.isInteger(apiId) || apiId <= 0) return res.status(400).json({
        success: false,
        message: "Invalid API Key ID"
    })

    const [apiKey] = await pool.query("SELECT id,is_active FROM api_keys WHERE id = ? AND user_id = ?",[apiId,userId])

    if(apiKey.length === 0) return res.status(404).json({
        success: false,
        message: "API Key Not Found"
    })

    if(apiKey[0].is_active) return res.status(409).json({
        success: false,
        message: "API Key is already active"
    })

    await pool.query("UPDATE api_keys SET is_active = true WHERE id = ? AND user_id = ?",[apiId,userId])

    return res.status(200).json({
        success: true,
        message: "API Key activated successfully"
    })
})



