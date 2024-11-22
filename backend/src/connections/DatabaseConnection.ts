import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import fs from 'fs';
dotenv.config();

const sslCaPath = path.join(__dirname, 'connections', 'ca.pem');

const databaseConnection: mysql.Connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  // ssl: {
  //   ca: sslCaPath,
  //   rejectUnauthorized: false,
  // },
});

databaseConnection.connect((err) => {
  if (err) {
    console.error('Connection Error:', err);
    console.error('Host:', process.env.DB_HOST);
    console.error('Port:', process.env.DB_PORT);
    console.error('User:', process.env.DB_USER);
    console.error('Database:', process.env.DB_NAME);
    return;
  }

  return console.log('Database connected');
});

// console.log('SSL Certificate Path:', sslCaPath);

export { databaseConnection };
