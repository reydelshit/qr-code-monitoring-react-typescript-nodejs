// import dotenv from 'dotenv';
// import mysql from 'mysql2';
// import path from 'path';
// import fs from 'fs';
// dotenv.config();

// const databaseConnection: mysql.Connection = mysql.createConnection({
//   // host: 'localhost',
//   // user: 'root',
//   // password: '',
//   // database: 'qr-code-monitoring',

//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT || '3306'),

//   ssl: {
//     ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
//     rejectUnauthorized: true,
//   },
// });

// databaseConnection.connect((err) => {
//   if (err) return console.log(err);

//   return console.log('Database connected');
// });

// export { databaseConnection };

// database.ts
import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import fs from 'fs';

dotenv.config();

let retryCount = 0;
const MAX_RETRIES = 3;

function createConnection() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
      rejectUnauthorized: true,
    },
    connectTimeout: 10000, // 10 seconds
    // acquireTimeout: 10000,
  });

  connection.on('error', function (err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' && retryCount < MAX_RETRIES) {
      console.log(
        `Attempting to reconnect... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
      );
      retryCount++;
      connection.destroy();
      databaseConnection = createConnection();
    } else if (retryCount >= MAX_RETRIES) {
      console.error('Max retry attempts reached');
    }
  });

  return connection;
}

let databaseConnection = createConnection();

databaseConnection.connect((err) => {
  if (err) {
    console.error('Connection error:', {
      code: err.code,
      message: err.message,
      fatal: err.fatal,
    });
    return;
  }
  console.log('Database connected successfully');
  retryCount = 0; // Reset retry count on successful connection
});

export { databaseConnection };
