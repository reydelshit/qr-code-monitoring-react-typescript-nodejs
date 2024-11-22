import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import routes from './routes';

const app: Application = express();
const PORT = parseInt(process.env.PORT as string, 10) || 3000;

// Correct paths to the SSL certificates inside the 'cert' folder
const privateKey = fs.readFileSync(
  path.resolve(__dirname, '..', 'cert', 'key.pem'),
  'utf8',
);
const certificate = fs.readFileSync(
  path.resolve(__dirname, '..', 'cert', 'cert.pem'),
  'utf8',
);

// Credentials object
const credentials = { key: privateKey, cert: certificate };

// Use CORS for cross-origin requests
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// Body parser for JSON
app.use(express.json());

// Static file serving for uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', routes);

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express + TypeScript API');
});

// Create HTTPS server
https.createServer(credentials, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on https://0.0.0.0:${PORT}`);
});
