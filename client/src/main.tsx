import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root';
import './index.css';
import AttendanceLog from './pages/AttendanceLog';
import Reports from './pages/Reports';
import StudentManagement from './pages/StudentManagement';
import ScanStation from './pages/ScanStation';
import ViewStudentDetails from './components/manage-student/ViewStudentDetails';
import Login from './pages/Login';
import Message from './pages/Message';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'attendance-log',
        element: <AttendanceLog />,
      },
      {
        path: 'Reports',
        element: <Reports />,
      },
      {
        path: 'message',
        element: <Message />,
      },
      {
        path: 'student-management',
        element: <StudentManagement />,
      },

      {
        path: 'student-management/:id',
        element: <ViewStudentDetails />,
      },

      {
        path: 'ScanStation',
        element: <ScanStation />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
