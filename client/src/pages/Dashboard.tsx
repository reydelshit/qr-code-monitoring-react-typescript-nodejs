import { MailCheck, ScrollText, UserCog } from 'lucide-react';
import moment from 'moment';
import useSWR from 'swr';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationTemplate from '@/components/Pagination';
import usePagination from '@/hooks/usePagination';

// const chartData = [
//   { month: 'January', total: 186, color: '#0D7C66' },
//   { month: 'February', total: 305, color: '#821131' },
//   { month: 'March', total: 237, color: '#2563eb' },
//   { month: 'April', total: 73, color: '#7c3aed' },
//   { month: 'May', total: 209, color: '#db2777' },
//   { month: 'June', total: 214, color: '#ea580c' },
//   { month: 'July', total: 189, color: '#65a30d' },
//   { month: 'August', total: 239, color: '#0891b2' },
//   { month: 'September', total: 349, color: '#4f46e5' },
//   { month: 'October', total: 278, color: '#b91c1c' },
//   { month: 'November', total: 298, color: '#854d0e' },
//   { month: 'December', total: 259, color: '#115e59' },
// ];

interface ChartData {
  month: string;
  total: number;
  color: string;
}

type ChartDataArray = ChartData[];

const CustomBar = (props: any) => {
  const { x, y, width, height, fill, payload } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={payload.color || fill}
    />
  );
};

const Dashboard = () => {
  const chartConfig = {
    total: {
      label: 'Total',
      color: '#CD5C08',
    },
  } satisfies ChartConfig;

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const fetcherCharData = async (url: string): Promise<ChartDataArray> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: chartData = [] } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/dashboard`,
    fetcherCharData,
  );

  const { data: messages = [] } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/messages`,
    fetcher,
  );

  const { data: attendance = [] } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/attendance`,
    fetcher,
  );

  const { data: students = [] } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/student`,
    fetcher,
  );

  const filteredAttendance = attendance
    ?.filter((today: any) => moment(today.timeIn).isSame(moment(), 'day'))
    .sort((a: any, b: any) => moment(b.timeIn).diff(moment(a.timeIn)));

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 8,
      data: filteredAttendance,
    });

  return (
    <div className="h-full w-full">
      <div className="my-4">
        <h1 className="text-6xl font-bold">Dashboard</h1>
        {/* <p className="font-semibold">Welcome to the dashboard</p> */}
      </div>

      <div className="pr-4">
        <div className="mt-[2rem] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex h-[10rem] items-center justify-center gap-10 rounded-3xl border-[1px] shadow-md">
            <div>
              <span className="block text-6xl font-bold">
                {students.length}
              </span>
              <p className="font-semibold">Total Students</p>
            </div>
            <UserCog color="orange" size={80} className="mr-2" />
          </div>

          <div className="flex h-[10rem] items-center justify-center gap-10 rounded-3xl border-[1px] shadow-md">
            <div>
              <span className="block text-6xl font-bold">
                {
                  attendance?.filter((today: any) =>
                    moment(today.timeIn).isSame(moment(), 'day'),
                  ).length
                }
              </span>
              <p className="font-semibold">Today's Attendance</p>
            </div>
            <ScrollText color="orange" size={80} className="mr-2" />
          </div>

          <div className="flex h-[10rem] items-center justify-center gap-10 rounded-3xl border-[1px] shadow-md">
            <div>
              <span className="block text-6xl font-bold">
                {messages.length}
              </span>
              <p className="font-semibold">Total Messages</p>
            </div>
            <MailCheck color="orange" size={80} className="mr-2" />
          </div>
        </div>
      </div>
      <div className="flex h-[450px] items-end gap-4">
        <ChartContainer
          config={chartConfig}
          className="mt-[2rem] max-h-[500px] w-[60%]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="total"
              fill="#000000"
              radius={4}
              shape={<CustomBar />}
            />
          </BarChart>
        </ChartContainer>

        <div className="flex h-full w-[40%] flex-col py-4">
          <h1 className="my-4 font-bold">TODAYS ENTRIES</h1>
          <p className="text-[12px] font-semibold">Only shows 8 per page</p>
          <Table className="w-full">
            <TableCaption>A list of todays attendance.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead className="w-[100px]">Student ID</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-[1rem] w-full text-[12px]">
              {currentItems.map((entry: any, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-sm font-semibold">
                      {entry.student_id_code}
                    </TableCell>
                    <TableCell className="text-[12px]">
                      {moment(entry.timeIn).format('llll')}
                    </TableCell>
                    <TableCell>
                      {entry.timeOut === 'n/a'
                        ? 'Not yet set'
                        : moment(entry.timeOut).format('llll')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <PaginationTemplate
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
