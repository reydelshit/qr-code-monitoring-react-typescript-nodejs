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
  port: parseInt(process.env.DB_PORT || '3306'),

  ssl: {
    ca: sslCaPath,
    rejectUnauthorized: false,
  },
});

databaseConnection.connect((err) => {
  if (err) return console.log(err);

  return console.log('Database connected');
});

console.log('SSL Certificate Path:', sslCaPath);

export { databaseConnection };
