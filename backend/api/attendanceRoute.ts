
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads')); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
  
  const upload = multer({ storage });
  
  
  
  // get all student
  router.get("/", (req, res) => {
    const query = "SELECT * FROM attendance";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
//   // specific student 
//   router.get("/:id", (req, res) => {
//     const query = "SELECT * FROM students WHERE student_id = ?"
//     const id = req.params.id
//     databaseConnection.query(query, id, (err, data) => {
//         if(err) return res.json(err)
//         return res.json(data)
//     })
//   })


  // specific attendance for today only 
router.get("/:id", (req, res) => {
        const query = "SELECT * FROM attendance WHERE student_id_code = ?"
        const id = req.params.id
        databaseConnection.query(query, [id], (err, data) => {
            if(err) return res.json(err)
            return res.json(data)
        })
 })
  
  
  //CREATE ATTENDANCE
  router.post("/create/time-in", (req, res) => {
    const query = `
      INSERT INTO attendance (
        student_id_code, 
        timeIn,
        timeOut,
        created_at
      ) 
      VALUES (?)
    `;
  
    const values = [
        req.body.student_id_code,
        req.body.timeIn,
        req.body.timeOut,
        req.body.created_at
    ];
  
    databaseConnection.query(query, [values], (err, data) => {
      if (err) return res.json(err);
  
      console.log("Data:", data);
  
      return res.json({
        ...data,
        lastID: data.insertId,
        message: "Successfully added",
        status: "success",
      });
    });
  });
  
  
  
  // UPDATE ATTENDANCE TIMEOUT
  router.put(`/update/time-out`, (req, res) => {
    const query = `
        UPDATE attendance a
        JOIN (
          SELECT attendance_id
          FROM attendance
          WHERE student_id_code =  ?
          ORDER BY timeIn DESC
          LIMIT 1
        ) AS latest ON a.attendance_id = latest.attendance_id
        SET a.timeOut = ?
        WHERE a.student_id_code =  ?;
      `;

  
  
    const values = [
        req.body.student_id_code,
        req.body.timeOut,
        req.body.student_id_code
    ];

    databaseConnection.query(query, [...values], (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully updated student",
        status: "success",
      });
    });
  });
  
  
  // DELETE STUDENT 

  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM students WHERE student_id = ?"
    const id = req.params.id
  
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json({
        ...data,
        message: "succesfully deleted",
        status: "success",
      })
    })
  })
  
  

  

  export const attendanceRouter = router;
  
  
  