import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Root = () => {
  const params = useLocation();

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn_QR');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };
  return (
    <div className="flex h-dvh w-dvw items-center justify-center overflow-y-hidden">
      <div className="mx-auto flex h-full w-full gap-4">
        <div className="relative flex h-screen w-[250px] flex-col border-r-[1px] p-2 pt-[4rem]">
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/' ? 'bg-orange-500 text-white' : ''}`}
            to="/"
          >
            Dashboard
          </Link>

          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/StudentManagement' ? 'bg-orange-500 text-white' : ''}`}
            to="/StudentManagement"
          >
            Student Management
          </Link>
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/AttendanceLog' ? 'bg-orange-500 text-white' : ''}`}
            to="/AttendanceLog"
          >
            Attendance Log
          </Link>
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/Reports' ? 'bg-orange-500 text-white' : ''}`}
            to="/Reports"
          >
            Reports
          </Link>
          <Link
            className={`p-2 hover:text-red-500 ${params.pathname === '/ScanStation' ? 'bg-orange-500 text-white' : ''}`}
            to="/ScanStation"
          >
            Scan Station
          </Link>

          {/* <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute right-2 top-[50%] border-2 p-2"
          >
            Toggle Sidebar
          </Button> */}

          <Button
            onClick={handleLogout}
            className="absolute bottom-2 left-2 right-2"
          >
            Logout
          </Button>
        </div>

        <div className="h-full w-full">
          {/* This is where the child routes get rendered */}
          {params.pathname === '/' ? <Dashboard /> : <Outlet />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Root;
