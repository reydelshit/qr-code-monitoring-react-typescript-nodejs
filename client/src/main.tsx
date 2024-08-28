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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'AttendanceLog',
        element: <AttendanceLog />,
      },
      {
        path: 'Reports',
        element: <Reports />,
      },
      {
        path: 'StudentManagement',
        element: <StudentManagement />,
      },

      {
        path: 'StudentManagement/:id',
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
