import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

// get all messages
router.get('/', (req, res) => {
  const query = 'SELECT * FROM messages';

  databaseConnection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.post('/upload-message', (req, res) => {
  const query = `INSERT INTO messages (student_id, content, dateSent, recepientNumber) VALUES (?)`;

  const value = [
    req.body.student_id,
    req.body.content,
    req.body.dateSent,
    req.body.recepientNumber,
  ];

  databaseConnection.query(query, [value], (err, data) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    return res.json({
      ...data,
      message: 'Successfully added message',
      status: 'success',
    });
  });
});

export const messageRouter = router;
