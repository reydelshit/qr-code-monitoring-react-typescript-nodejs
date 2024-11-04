import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';



const databaseConnection: mysql.Connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'qr-code-monitoring',

// s 
    host: 'mysql-2585ff3d-reydel321-f5a4.h.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_tCXIZezqSVfOC-pXWWD',
    database: 'qr-code-monitoring',
    port: 12163,

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