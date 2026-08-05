import crypto from 'crypto'
import asyncHandler from '../utils/asyncHandler.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt'

export const generateApiKey = asyncHandler(async (req, res) => {

    const user_id = req.user.id;

    const API_KEY_PREFIX = "apf";

    const publicPrefix = crypto.randomBytes(4).toString("hex");

    const secret = crypto.randomBytes(32).toString("hex")

    const apiKey = `${API_KEY_PREFIX}_${publicPrefix}.${secret}`;

    const secretHash = await bcrypt.hash(secret, 10);

    const [result] = await pool.query("INSERT INTO api_keys(key_prefix,key_hash,user_id) VALUES(?,?,?)", [publicPrefix, secretHash, user_id])

    return res.status(201).json({
        success: true,
        message: "API Key Generated Successfully",
        apiKey
    });
})



