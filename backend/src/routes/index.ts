import { Router } from 'express';
import { studentRouter } from '../api/studentRoute';
import { attendanceRouter } from '../api/attendanceRoute';
import { messageRouter } from '../api/messagesRoute';
import { dashboardRouter } from '../api/dashboardRoute';

const router = Router();

router.use('/student', studentRouter);
router.use('/attendance', attendanceRouter);
router.use('/messages', messageRouter);
router.use('/dashboard', dashboardRouter);

export default router;
