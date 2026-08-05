import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"

export const apiKeyMiddleware = asyncHandler(async (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) return res.status(401).json({
        success: false,
        message: "API Key is Required"
    })

    if (!apiKey.includes("_") || !apiKey.includes(".") || !apiKey.startsWith("apf_")) return res.status(401).json({
        success: false,
        message: "Invalid API Key"
    })

    const [prefixPart, secret] = apiKey.split(".");
    const [, publicPrefix] = prefixPart.split("_");

    const [result] = await pool.query("SELECT * FROM api_keys WHERE key_prefix = ?", [publicPrefix])

    if (result.length === 0) return res.status(401).json({
        success: false,
        message: "Invalid API Key"
    })

    const apiRecord = result[0];

    if (!apiRecord.is_active) return res.status(401).json({
        success: false,
        message: "Invalid API Key"
    })

    const isSecretValid = await bcrypt.compare(secret, apiRecord.key_hash)

    if (!isSecretValid) return res.status(401).json({
        success: false,
        message: "Invalid API Key"
    })

    await pool.query(
        "UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?",
        [apiRecord.id]
    );

    req.apiKey = apiRecord
    req.user = {
        id: apiRecord.user_id
    }

    next();
})