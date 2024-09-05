
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();



  //for graph
  router.get("/", (req, res) => {
    const query = `WITH RECURSIVE months(month_number) AS (
  SELECT 1
  UNION ALL
  SELECT month_number + 1
  FROM months
  WHERE month_number < 12
),
monthly_totals AS (
  SELECT
    EXTRACT(MONTH FROM timeIn) AS month_number,
    COUNT(*) AS total
  FROM
    attendance
  WHERE
    EXTRACT(YEAR FROM timeIn) = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY
    EXTRACT(MONTH FROM timeIn)
)
SELECT
  CASE
    WHEN months.month_number = 1 THEN 'January'
    WHEN months.month_number = 2 THEN 'February'
    WHEN months.month_number = 3 THEN 'March'
    WHEN months.month_number = 4 THEN 'April'
    WHEN months.month_number = 5 THEN 'May'
    WHEN months.month_number = 6 THEN 'June'
    WHEN months.month_number = 7 THEN 'July'
    WHEN months.month_number = 8 THEN 'August'
    WHEN months.month_number = 9 THEN 'September'
    WHEN months.month_number = 10 THEN 'October'
    WHEN months.month_number = 11 THEN 'November'
    WHEN months.month_number = 12 THEN 'December'
  END AS month,
  COALESCE(monthly_totals.total, 0) AS total,
  CASE
    WHEN months.month_number = 1 THEN '#0D7C66'
    WHEN months.month_number = 2 THEN '#821131'
    WHEN months.month_number = 3 THEN '#2563eb'
    WHEN months.month_number = 4 THEN '#7c3aed'
    WHEN months.month_number = 5 THEN '#db2777'
    WHEN months.month_number = 6 THEN '#ea580c'
    WHEN months.month_number = 7 THEN '#65a30d'
    WHEN months.month_number = 8 THEN '#0891b2'
    WHEN months.month_number = 9 THEN '#4f46e5'
    WHEN months.month_number = 10 THEN '#b91c1c'
    WHEN months.month_number = 11 THEN '#854d0e'
    WHEN months.month_number = 12 THEN '#115e59'
  END AS color
FROM
  months
LEFT JOIN
  monthly_totals ON months.month_number = monthly_totals.month_number
ORDER BY
  months.month_number;`;
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });

  
  
  
  

  

  export const dashboardRouter = router;
  
  
  