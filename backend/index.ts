import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import mysql from 'mysql';
import multer from 'multer';
import { stat } from 'fs';


dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 8800;



interface UserPayload extends JwtPayload {
    userId?: number;
    username: string;
}

interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

const databaseConnection: mysql.Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'qr-code-monitoring',
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('Serving static files from:', path.join(__dirname, 'uploads'));

const SECRET_KEY = 'REYDEL'; 

databaseConnection.connect((err) => {
 if(err) return console.log(err);

 return console.log('Database connected');
})


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});


const users = [
    { userId: 1, username: 
      process.env.VITE_USERNAME, password:  process.env.VITE_PASSWORD },
];


// LOGIN API 
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const token = jwt.sign({ userId: user.userId, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      return res.json({ message: 'Login successful', token: token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// VALIDATE TOKEN 
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err: VerifyErrors | null, decoded: unknown) => {
        if (err) return res.sendStatus(403);
        
        const user = decoded as UserPayload;
        req.user = user;
        next();
    });
}

app.get('/protected', authenticateToken, (req: AuthenticatedRequest, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});


// get all student
app.get("/student", (req, res) => {
  // console.log(req.query)
  const query = "SELECT * FROM students";
  // const username = req.query.username; 
  // const password = req.query.password;
  // const values = [username, password];

  databaseConnection.query(query, (err, data) => {
      if (err) return res.json(err);
      return res.json(data); 
  });
});


// specific student 
app.get("/student/:id", (req, res) => {
  const query = "SELECT * FROM students WHERE student_id = ?"
  const id = req.params.id
  databaseConnection.query(query, id, (err, data) => {
      if(err) return res.json(err)
      return res.json(data)
  })
})


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


const upload = multer({ storage });

//CREATE STUDENT
app.post("/student/create", upload.single('student_image_path'), (req, res) => {

  const imagePath = req.file ? 
    path.join('uploads', req.file.filename)
  : 'uploads/66bb6e4ac9ef7.jpeg'; 


  console.log("Image Path:", imagePath);

  const query = `
    INSERT INTO students (
      student_id_code, 
      student_image_path, 
      student_name, 
      student_datebirth, 
      student_address, 
      student_gender, 
      student_grade_level, 
      student_program, 
      student_block_section, 
      student_parent_name, 
      student_parent_number, 
      student_parent_email
    ) 
    VALUES (?)
  `;

  const values = [
    req.body.student_id_code,
    imagePath,
    req.body.student_name,
    req.body.student_datebirth,
    req.body.student_address,
    req.body.student_gender,
    req.body.student_grade_level,
    req.body.student_program,
    req.body.student_block_section,
    req.body.student_parent_name,
    req.body.student_parent_number,
    req.body.student_parent_email
  ];

  databaseConnection.query(query, [values], (err, data) => {
    if (err) return res.json(err);

    console.log("Data:", data);

    return res.json({
      ...data,
      message: "Successfully added",
      status: "success",
    });
  });
});



// UPDATE STUDENT 
app.put(`/student/update/:id`, upload.single('student_image_path'), (req, res) => {
  const query = `
    UPDATE students 
    SET 
      student_id_code = ?,
      student_image_path = ?,
      student_name = ?,
      student_datebirth = ?,
      student_address = ?,
      student_gender = ?,
      student_grade_level = ?,
      student_program = ?,
      student_block_section = ?,
      student_parent_name = ?,
      student_parent_number = ?,
      student_parent_email = ?
    WHERE student_id = ?
  `;

  const id = req.params.id;
  const imagePath = req.file ? 
    path.join('uploads', req.file.filename)
  : req.body.student_image_path; 

  const values = [
    req.body.student_id_code,
    imagePath,
    req.body.student_name,
    req.body.student_datebirth,
    req.body.student_address,
    req.body.student_gender,
    req.body.student_grade_level,
    req.body.student_program,
    req.body.student_block_section,
    req.body.student_parent_name,
    req.body.student_parent_number,
    req.body.student_parent_email
  ];

  console.log("SQL Query:", query);
  console.log("Values:", [...values, id]);

  databaseConnection.query(query, [...values, id], (err, data) => {
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

app.delete("/student/:id", (req, res) => {
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







//register
app.post("/users", (req, res) => {
  const query = "INSERT INTO users (`fullname`, `username`, `password`, `created_at`) VALUES (?)"
  const created_at = new Date()

  const values = [
      req.body.first_name + " " + req.body.last_name,
      req.body.username,
      req.body.password,
      created_at
  ]

  databaseConnection.query(query, [values], (err, data) => {
      if(err) return res.json(err)
      return res.json({
      ...data,
      message: "succesfully added"
     
      })
  })
})



// all books 
app.get("/expenses", (req, res) => {
  const query = "SELECT * FROM expenses"
  databaseConnection.query(query, (err, data) => {
      if(err) return res.json(err)
      return res.json(data)
  })
})





app.post("/expenses", (req, res) => {
  const query = "INSERT INTO expenses (`expense_name`, `price`, `date`) VALUES (?)"
  const values = [
      req.body.expense_name,
      req.body.price,
  ]

  databaseConnection.query(query, [values] , (err, data) => {
      if(err) return res.json(err)
      return res.json({
      ...data,
      date: new Date(),
      message: "succesfully added"
      })
  })
})


app.put(`/books/update/:id`, (req, res) => {
  const query = "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ?, `price` = ? WHERE id = ?"
  const id = req.params.id
  const values = [
      req.body.title,
      req.body.desc,
      req.body.cover,
      req.body.price
  ]

  databaseConnection.query(query, [...values, id] , (err, data) => {
      if(err) return res.json(err)
      return res.json({
      ...data,
      message: "succesfully updated"
      })
  })
})