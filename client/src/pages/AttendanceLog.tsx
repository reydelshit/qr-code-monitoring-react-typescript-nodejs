import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useSWR from 'swr';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import AttendanceTable from '@/components/attendance/AttendanceTable';

interface Attendance {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}

const AttendanceLog = () => {
  const fetcher = async (url: string): Promise<Attendance[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const {
    data: attendance = [],
    error,
    isLoading,
    mutate,
  } = useSWR(`${import.meta.env.VITE_SERVER_LINK}/attendance`, fetcher);

  console.log(attendance);

  return (
    <div>
      <h1 className="my-4 text-6xl font-bold">Attendance</h1>

      <div className="mt-[2rem]">
        <AttendanceTable attendance={attendance} />
      </div>
    </div>
  );
};

export default AttendanceLog;
