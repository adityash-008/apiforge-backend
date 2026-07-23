import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Aditya#75",
    database: "apiforge_db"
})

console.log("✅ MySQL Connected");

export default connection;