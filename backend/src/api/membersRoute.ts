import { Router, Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { databaseConnection } from '../connections/DatabaseConnection';
import { deleteRow } from '../connections/deleteBackup';
// import { backupDatabase } from '../connections/backupDB';

const router = Router();

// TypeScript interface for Member data
interface MemberItem {
  member_id: number;
  name: string;
  username: string;
  password: string;
  accessDuration: string; // E.g., "30 days", "1 year"
  permissions: string[]; // Array of permissions
  created_at: Date;
}

// Get all members
router.get('/', (req: Request, res: Response) => {
  const query = 'SELECT * FROM members ORDER BY created_at DESC';

  databaseConnection.query(query, (err, data: RowDataPacket[]) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
        message: 'Failed to retrieve members',
      });
    }
    return res.json(data);
  });
});

// Get a specific member by ID
router.get('/speci/:id', (req: Request<{ id: string }>, res: Response) => {
  const query = 'SELECT * FROM members WHERE member_id = ?';
  const id = req.params.id;

  databaseConnection.query(
    query,
    [id],
    (err, data: RowDataPacket[] | ResultSetHeader) => {
      if (err) return res.status(500).json({ error: err.message });

      if (Array.isArray(data) && data.length > 0) {
        return res.json(data[0]);
      }

      return res.status(404).json({ message: 'Member not found' });
    },
  );
});

// Add a new member
router.post('/create', (req: Request, res: Response) => {
  const query = `
    INSERT INTO members (name, username, password, accessDuration, permissions, created_at) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const created_at = new Date();
  const { name, username, password, accessDuration, permissions } =
    req.body as MemberItem;
  const permissionsString = JSON.stringify(permissions); // Store permissions as JSON

  //   const mappedPermissions = permissions.map((p) => );
  const values = [
    name,
    username,
    password,
    accessDuration,
    permissionsString,
    created_at,
  ];

  databaseConnection.query(query, values, (err, data: ResultSetHeader) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // backupDatabase();

    return res.json({
      ...data,
      message: 'Successfully added member',
      status: 'success',
    });
  });
});

// Update an existing member
router.put('/update/:id', (req: Request<{ id: string }>, res: Response) => {
  const query = `
    UPDATE members 
    SET name = ?, 
        username = ?, 
        password = ?, 
        accessDuration = ?, 
        permissions = ?
    WHERE member_id = ?
  `;

  const { name, username, password, accessDuration, permissions } =
    req.body as Partial<MemberItem>;
  const permissionsString = JSON.stringify(permissions);

  const values = [
    name,
    username,
    password,
    accessDuration,
    permissionsString,
    parseInt(req.params.id),
  ];

  databaseConnection.query(query, values, (err, data: ResultSetHeader) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database update failed' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    return res.json({
      message: 'Successfully updated member',
      status: 'success',
    });
  });
});

// Delete a member
router.delete(
  '/delete/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    const query = 'DELETE FROM members WHERE member_id = ?';
    const id = parseInt(req.params.id);

    databaseConnection.query(query, [id], (err, data: ResultSetHeader) => {
      if (err) return res.status(500).json({ error: err.message });

      if (data.affectedRows === 0) {
        return res.status(404).json({ message: 'Member not found' });
      }

      return res.json({
        message: 'Successfully deleted member',
        status: 'success',
      });
    });
  },
);

export const membersRouter = router;
