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

interface Attendance extends Record<string, React.ReactNode> {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}

const AttendanceLog = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredAttendance = attendance.filter((data) =>
    date !== undefined
      ? moment(data.timeIn).format('LL') === moment(date).format('LL')
      : data,
  );

  const currentItems = filteredAttendance.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="my-4 text-6xl font-bold">Attendance</h1>

      <div className="mt-[2rem] flex h-[2.5rem] justify-between pr-4">
        <Input className="h-full w-[20rem]" placeholder="Search student.." />

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
      <div className="mt-[2rem]">
        <Table>
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

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() =>
                    currentPage === 1
                      ? handlePageChange(totalPages)
                      : handlePageChange(currentPage - 1)
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      className={`mx-1 ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    currentPage === totalPages
                      ? handlePageChange(1)
                      : handlePageChange(currentPage + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* <AttendanceTable attendance={attendance} /> */}
      </div>
    </div>
  );
};

export default AttendanceLog;
