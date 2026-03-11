require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importSQL() {
  console.log('Connecting to:', process.env.MYSQLHOST, ':', process.env.MYSQLPORT);

  const conn = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT),
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    multipleStatements: true,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
      rejectUnauthorized: true
    }
  });

  console.log('Connected to Aiven!');

  const sql = fs.readFileSync(path.join(__dirname, 'online.sql'), 'utf-8');
  await conn.query(sql);

  console.log('Done! online.sql imported successfully!');
  await conn.end();
}

importSQL().catch(console.error);