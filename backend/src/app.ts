import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import routes from './routes';
import path from 'path';

const app: Application = express();
const PORT = process.env.PORT || 8800;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express + TypeScript API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
