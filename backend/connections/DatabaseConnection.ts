import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const databaseConnection: mysql.Connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'qr-code-monitoring',


    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),

    ssl: {
      ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
      rejectUnauthorized: true,  
  }
  });
  
  
  databaseConnection.connect((err) => {
   if(err) return console.log(err);
  
   return console.log('Database connected');
  })

  export { databaseConnection };