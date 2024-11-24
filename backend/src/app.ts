import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import routes from './routes';
import { backupDatabase } from './connections/backupDB';

const app: Application = express();
const PORT = parseInt(process.env.PORT as string, 10) || 3000;

const privateKey = fs.readFileSync(
  path.resolve(__dirname, '..', 'cert', 'key.pem'),
  'utf8',
);
const certificate = fs.readFileSync(
  path.resolve(__dirname, '..', 'cert', 'cert.pem'),
  'utf8',
);

const credentials = { key: privateKey, cert: certificate };

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(async (req: Request, res: Response, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      await backupDatabase();
      console.log('Backup completed successfully');
    } catch (err) {
      console.error('Error during backup:', err);
      res.status(500).send('Failed to perform backup');
      return;
    }
  }
  next();
});

app.use(express.json());

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express + TypeScript API');
});

https.createServer(credentials, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on https://0.0.0.0:${PORT}`);
});
