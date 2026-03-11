require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  connectTimeout: 30000,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to Aiven MySQL!");
});

module.exports = db;