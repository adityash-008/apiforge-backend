import pool from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,} = req.body;
    if(!name || !email || !password) return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
    })

    const [isEmailExist] = await pool.query("SELECT 1 FROM users WHERE email = ? LIMIT 1",[email])

    if(isEmailExist.length > 0) return res.status(409).json({
        success: false,
        message: "Email already exists"
    }) 

    const hashedPassword = await bcrypt.hash(password,10);
    
    const [result] = await pool.query("INSERT INTO users (name,email,password) VALUES(?,?,?)",
        [name,email,hashedPassword]
    )

    return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        userId: result.insertId
    })
    
});

export const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) return res.status(401).json({
        success: false,
        message: "Unauthorized Access"
    })

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?",[email])

    if(users.length === 0) return res.status(404).json({
        success: false,
        message: "User Not Found!"
    })

    const isMatch = await bcrypt.compare(password,users[0].password);
    if(!isMatch) return res.status(401).json({
        success: true,
        message: "Invalid Email or Password"
    })

    const token = jwt.sign(
        {id: users[0].id},
        process.env.JWT_SECRET,
        {
        expiresIn: "1d"
        }
    )

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // true in production with HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
    });
    
    return res.status(200).json({
        success: true,
        message: "Login Successful"
    })
});

