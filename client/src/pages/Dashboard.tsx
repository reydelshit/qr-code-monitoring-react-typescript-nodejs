import { MailCheck, ScrollText, UserCog } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="my-4">
        <h1 className="text-6xl font-bold">Dashboard</h1>
        {/* <p className="font-semibold">Welcome to the dashboard</p> */}
      </div>

      <div className="pr-4">
        <div className="mt-[2rem] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex h-[10rem] items-center justify-center gap-10 rounded-3xl border-[1px] shadow-md">
            <div>
              <span className="block text-6xl font-bold">20</span>
              <p className="font-semibold">Total Students</p>
            </div>
            <UserCog color="orange" size={80} className="mr-2" />
          </div>

          <div className="flex h-[10rem] items-center justify-center gap-10 rounded-3xl border-[1px] shadow-md">
            <div>
              <span className="block text-6xl font-bold">99</span>
              <p className="font-semibold">Today's Attendance</p>
            </div>
            <ScrollText color="orange" size={80} className="mr-2" />
          </div>

          <div className="flex h-[10rem] items-center justify-center gap-10 rounded-3xl border-[1px] shadow-md">
            <div>
              <span className="block text-6xl font-bold">69</span>
              <p className="font-semibold">Total Messages</p>
            </div>
            <MailCheck color="orange" size={80} className="mr-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
