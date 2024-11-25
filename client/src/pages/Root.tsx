import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import {
  ChartBarBig,
  LayoutGrid,
  MailCheck,
  Network,
  QrCode,
  ScrollText,
  UserCog,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface MemberItem {
  member_id?: number;
  name: string;
  username: string;
  password?: string;
  accessDuration: string;
  permissions: string[];
  created_at?: Date;
}

const permissions = [
  {
    id: 'view-attendance',
    label: 'Attendance',
    path: '/attendance-log',
    icon: ScrollText,
  },
  {
    id: 'manage-student',
    label: 'Students',
    path: '/student-management',
    icon: UserCog,
  },
  {
    id: 'view-reports',
    label: 'Reports',
    path: '/Reports',
    icon: ChartBarBig,
  },
  {
    id: 'scan-qr-code',
    label: 'Scan Station',
    path: '/ScanStation',
    icon: QrCode,
  },

  {
    id: 'manage-members',
    label: 'Manage Members',
    path: '/members',
    icon: Network,
  },
];

const Root = () => {
  const params = useLocation();
  const userRole = localStorage.getItem('role');
  const userDetails: MemberItem = JSON.parse(
    localStorage.getItem('user') || '{}',
  );
  const navigate = useNavigate();

  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      try {
        setUserPermissions(JSON.parse(storedPermissions));
      } catch (error) {
        console.error('Failed to parse permissions from localStorage:', error);
      }
    }
  }, []);
  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn_QR')) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn_QR');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');

    window.location.href = '/login';
  };

  const parseAccessDuration = (duration: string): number => {
    console.log(`Parsing access duration: ${duration}`);
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    console.log(`Parsed duration: ${totalMilliseconds}ms`);
    return totalMilliseconds;
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User details from localStorage:', userDetails);

    if (userDetails.accessDuration) {
      let durationInMs = parseAccessDuration(userDetails.accessDuration);

      if (durationInMs) {
        console.log('Setting timeout for logout. Duration:', durationInMs);

        const countdownTimer = setInterval(() => {
          console.log(`Time remaining: ${durationInMs}ms`);

          if (durationInMs <= 0) {
            clearInterval(countdownTimer);
            console.log('Logging out due to session expiry');
            handleLogout();
          } else {
            durationInMs -= 1000;
          }
        }, 1000);

        return () => {
          console.log('Clearing countdown timer');
          clearInterval(countdownTimer);
        };
      }
    }
  }, []);

  useEffect(() => {
    const hasPermission = permissions.some(
      (permission) =>
        userRole === 'admin' || userPermissions.includes(permission.id),
    );

    if (!hasPermission) {
      navigate('/'); // Redirect to the dashboard
    }
  }, [userPermissions, userRole, permissions, navigate]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative mx-auto flex h-full w-full gap-4">
        <div
          className={`sticky left-0 top-0 flex h-screen w-[250px] flex-col gap-2 border-r-[1px] p-2`}
        >
          {userRole === 'user' ? (
            <div className="mb-[2rem]">
              <h1 className="text-2xl font-bold">{userDetails.name}</h1>
              <p className="text-sm text-muted-foreground">
                {userDetails.username}
              </p>

              <p className="text-sm text-muted-foreground">
                Only access have {userDetails.accessDuration}
              </p>
            </div>
          ) : (
            <div className="mt-[1rem] text-center">
              <h1 className="text-2xl font-bold">Admin</h1>
            </div>
          )}

          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/"
            >
              {' '}
              <LayoutGrid className="mr-2 w-[1.2rem]" /> Dashboard
            </Link>
          </Button>

          <>
            {permissions.map((permission) => {
              if (
                userRole === 'admin' ||
                userPermissions.includes(permission.id)
              ) {
                const Icon = permission.icon;
                return (
                  <Button
                    key={permission.id}
                    variant={'outline'}
                    className={`border-none p-2 ${
                      params.pathname === permission.path
                        ? 'bg-black text-white'
                        : ''
                    }`}
                  >
                    <Link
                      className="text-md flex w-full items-center justify-start"
                      to={permission.path}
                    >
                      <Icon className="mr-2 w-[1.2rem]" /> {permission.label}
                    </Link>
                  </Button>
                );
              }
              return null;
            })}
          </>

          <Button
            onClick={handleLogout}
            className="absolute bottom-2 left-2 right-2"
          >
            Logout
          </Button>
        </div>

        <div className="h-full w-full">
          {/* <Button
            onClick={() => {
              localStorage.removeItem('isLoggedIn_QR');
              localStorage.removeItem('role');
            }}
            className="absolute right-8 top-8 z-10 cursor-pointer"
          >
            <Link to={'/scan'}>Switch to Scan Station</Link>
          </Button> */}
          {params.pathname === '/' ? <Dashboard /> : <Outlet />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Root;
