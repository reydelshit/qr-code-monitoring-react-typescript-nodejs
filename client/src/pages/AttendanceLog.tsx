import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import moment from 'moment';
import useSWR from 'swr';

import { ExportPDF } from '@/components/ExportPDF';
import PaginationTemplate from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/usePagination';
import { useState } from 'react';

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
  const [showAllTime, setShowAllTime] = useState(false);

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
    // mutate,
  } = useSWR(`${import.meta.env.VITE_SERVER_LINK}/attendance`, fetcher);

  const filteredAttendance = attendance
    .filter((data) => {
      if (showAllTime) {
        return true;
      }

      return date !== undefined
        ? moment(data.timeIn).format('LL') === moment(date).format('LL')
        : true;
    })
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
          placeholder="Search student by ID Code"
        />

        <div className="inline-flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="h-full w-[240px] rounded-lg"
              >
                Filter by Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Button
                onClick={() => setShowAllTime(true)}
                className="my-2 w-full"
                variant={'secondary'}
              >
                {' '}
                All Time
              </Button>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  // console.log(date),
                  setDate(date), console.log('Selected date:', date);
                  setShowAllTime(false);
                }}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>

          <ExportPDF
            data={filteredAttendance}
            fileName={`Attendance_ ${date ? moment(date).format('LL') : 'All Time'}`}
            title={`Attendance Log for ${date ? moment(date).format('LL') : 'All Time'}`}
          />
        </div>
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
