import TableTemplate from '@/components/TableTemplate';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import useSWR from 'swr';
import moment from 'moment';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import usePagination from '@/hooks/usePagination';
import PaginationTemplate from '@/components/Pagination';

interface Attendance extends Record<string, React.ReactNode> {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}

const AttendanceLog = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');

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

  const filteredAttendance = attendance
    .filter((data) =>
      date !== undefined
        ? moment(data.timeIn).format('LL') === moment(date).format('LL')
        : data,
    )
    .filter((data) =>
      data.student_id_code.toLowerCase().includes(search.toLowerCase()),
    );

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 15,
      data: filteredAttendance,
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="h-full w-full overflow-hidden overflow-y-hidden">
      <h1 className="my-4 text-6xl font-bold">Attendance</h1>

      <div className="mt-[2rem] flex h-[2.5rem] w-full justify-between">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="h-full w-[20rem]"
          placeholder="Search student.."
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className="h-full w-[240px] rounded-lg">
              Filter by Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) =>
                (
                  // console.log(date),
                  setDate(date), console.log('Selected date:', date)
                )
              }
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-[2rem] w-full">
        <h1 className="my-2 font-semibold">Only shows 15 per page</h1>

        <Table className="w-full">
          <TableCaption>A list of attendance log.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Log Date</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Departure Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance &&
              currentItems.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.student_id_code}</TableCell>
                  <TableCell>{moment(data.timeIn).format('LL')}</TableCell>

                  <TableCell>
                    {data.timeIn !== 'n/a' &&
                      data.timeIn !== null &&
                      moment(data.timeIn).format('LT')}
                  </TableCell>
                  <TableCell>
                    {' '}
                    {data.timeIn !== 'n/a' &&
                      data.timeIn !== null &&
                      'Enter the campus'}
                  </TableCell>

                  <TableCell>
                    {data.timeOut !== 'n/a' && data.timeOut !== null
                      ? moment(data.timeOut).format('LT')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {' '}
                    {data.timeOut !== 'n/a' && data.timeOut !== null
                      ? 'Exit the campus'
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <PaginationTemplate
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />

        {/* <AttendanceTable attendance={attendance} /> */}
      </div>
    </div>
  );
};

export default AttendanceLog;
