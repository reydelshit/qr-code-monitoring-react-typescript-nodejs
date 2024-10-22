import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import moment from 'moment';
import useSWR from 'swr';

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
import { ExportPDF } from '@/components/ExportPDF';
import {
  CalendarDays,
  CalendarMinus2,
  CalendarRange,
  Users,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import QRCode from 'react-qr-code';
import { Student } from '@/types/student';

interface Attendance extends Record<string, React.ReactNode> {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}
const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');

  const [filterType, setFilterType] = useState('all time');
  const [showStudents, setShowStudents] = useState(false);

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

  const fetcherStudent = async (url: string): Promise<Student[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: students = [] } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/student`,
    fetcherStudent,
  );

  const filteredStudents = students.filter((student) => {
    return (
      student.student_name.toLowerCase().includes(search.toLowerCase()) ||
      student.student_id_code.toLowerCase().includes(search.toLowerCase())
    );
  });

  const {
    currentItems: currentItemsStudent,
    totalPages: totalPagesStudent,
    currentPage: totalCurrentPagesStudent,
    handlePageChange: handlePageCHangeStudent,
  } = usePagination({
    itemsPerPage: 10,
    data: filteredStudents,
  });

  const filteredAttendance = attendance
    .filter((data) => {
      if (filterType === 'all time') {
        return true;
      }

      if (filterType === 'daily') {
        return moment(data.timeIn).isSame(moment(), 'day');
      } else if (filterType === 'weekly') {
        return moment(data.timeIn).isSame(moment(), 'week');
      } else if (filterType === 'monthly') {
        return moment(data.timeIn).isSame(moment(), 'month');
      }
    })
    .filter((data) =>
      data.student_id_code.toLowerCase().includes(search.toLowerCase()),
    );

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 15,
      data: filteredAttendance,
    });

  const handleFilterClick = (type: string) => {
    setFilterType((prev) => (prev === type ? '' : type));

    setShowStudents(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h1 className="my-4 text-6xl font-bold">Reports</h1>

      <div className="flex gap-4">
        <div className="mt-[2rem] flex w-fit flex-col items-start justify-start gap-4">
          {/* <h1 className="text-xl font-semibold">Filter</h1> */}

          <span className="text-start text-xl font-semibold">LOGS</span>
          <div
            className="inline-flex cursor-pointer flex-col items-center justify-center"
            onClick={() => handleFilterClick('all time')}
          >
            <CalendarRange
              color={filterType === 'all time' ? 'blue' : 'black'}
              size={50}
            />
            All time
          </div>
          <div
            onClick={() => handleFilterClick('daily')}
            className="inline-flex cursor-pointer flex-col items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke={`${filterType === 'daily' ? 'blue' : 'black'}`}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className={`lucide lucide-calendar-1 ${filterType === 'daily' ? 'blue' : 'black'}`}
            >
              <path d="M11 14h1v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />
              <path d="M8 2v4" />
              <rect x="3" y="4" width="18" height="18" rx="2" />
            </svg>
            Daily
          </div>
          <div
            onClick={() => handleFilterClick('weekly')}
            className="inline-flex cursor-pointer flex-col items-center justify-center"
          >
            <CalendarMinus2
              color={filterType === 'weekly' ? 'blue' : 'black'}
              size={50}
            />
            Weekly
          </div>
          <div
            onClick={() => handleFilterClick('monthly')}
            className="inline-flex cursor-pointer flex-col items-center justify-center"
          >
            <CalendarDays
              color={filterType === 'monthly' ? 'blue' : 'black'}
              size={50}
            />
            Monthly
          </div>

          <Separator />

          <span className="text-start text-xl font-semibold">Students</span>

          <div
            onClick={() => {
              setShowStudents(true);
              setFilterType('');
            }}
            className="inline-flex cursor-pointer flex-col items-center justify-center"
          >
            <Users color={showStudents ? 'blue' : 'black'} size={50} />
            Records
          </div>
        </div>

        {!showStudents ? (
          <div className="mt-[2rem] w-full">
            <div className="flex items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[2.5rem] w-[15rem] rounded-xl"
                  placeholder="Search student by ID Code"
                />
                <h1 className="my-2 font-semibold">Only shows 15 per page</h1>
              </div>
              <div className="flex items-center gap-4">
                <p className="uppercase">
                  Currently Showing:{' '}
                  <span className="font-semibold">{filterType}</span>
                </p>

                <ExportPDF
                  data={filteredAttendance}
                  fileName={`Attendance_ ${filterType}`}
                  title={`Attendance Log for ${filterType}`}
                />
              </div>
            </div>
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
        ) : (
          <div className="w-full">
            <div className="mx-2 mt-2 flex justify-between">
              <p className="text-sm">
                Showing {currentItemsStudent.length} of {students.length}{' '}
                students.
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  {currentItemsStudent.length} number of students registed in
                  the system.
                </p>

                <ExportPDF
                  data={currentItemsStudent.map((student) => {
                    return {
                      IDCODE: student.student_id_code,
                      NAME: student.student_name,
                      DATEBIRTH: student.student_datebirth,
                      ADDRES: student.student_address,
                      YEAR: student.student_grade_level,
                      BLOCKSECTION: student.student_block_section,
                    };
                  })}
                  fileName={`Students`}
                  title={`List of Students`}
                />
              </div>
            </div>
            <Table className="my-4 w-full">
              <TableCaption>A list of registered students.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Fullname</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItemsStudent?.map((student, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          className="h-[4rem] w-[4rem] object-cover"
                          src={`${import.meta.env.VITE_SERVER_LINK}/${student.student_image_path}`}
                          alt="student"
                        />
                      </TableCell>
                      <TableCell className="mx-auto grid place-items-center text-center">
                        <QRCode
                          size={15}
                          style={{
                            height: 'auto',
                            maxWidth: '100%',
                            width: '50%',
                          }}
                          value={student.student_id_code}
                          viewBox={`0 0 256 256`}
                        />

                        <span className="font-semibold">
                          {' '}
                          {student.student_id_code}
                        </span>
                      </TableCell>
                      <TableCell>{student.student_name}</TableCell>
                      <TableCell>{student.student_datebirth}</TableCell>
                      <TableCell>{student.student_address}</TableCell>
                      <TableCell>{student.student_gender}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <PaginationTemplate
              totalPages={totalPagesStudent}
              currentPage={totalCurrentPagesStudent}
              handlePageChange={handlePageCHangeStudent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
