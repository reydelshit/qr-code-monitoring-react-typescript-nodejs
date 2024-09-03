import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import moment from 'moment';
import ProfileDefault from '@/assets/profile.webp';
import { IDetectedBarcode } from '@/types/scan-station';
import { Attendance } from '@/types/scan-station';
import { Student } from '@/types/scan-station';
import usePagination from '@/hooks/usePagination';
import { CircleHelp, QrCode } from 'lucide-react';
import PaginationTemplate from '../Pagination';

interface TimeOutType {
  studentID: string;
  setStudentID: (studentID: string) => void;
  student: Student;
  fetchStudentData: (studentID: string) => void;
  attendance: Attendance[];
  handleTimeOut: (studentID: string) => void;
  showManualInput: boolean;
  setShowManualInput: (showManualInput: boolean) => void;
  fetchAttendanceForTimeout: (studentID: string) => void;
}
const TimeOut: React.FC<TimeOutType> = ({
  studentID,
  setStudentID,
  student,
  fetchStudentData,
  attendance,
  handleTimeOut,
  showManualInput,
  setShowManualInput,
  fetchAttendanceForTimeout,
}) => {
  const filteredAttendance = attendance
    ?.filter((today) => moment(today.timeIn).isSame(moment(), 'day'))
    .sort((a, b) => moment(b.timeIn).diff(moment(a.timeIn)));

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 10,
      data: filteredAttendance,
    });

  return (
    <>
      <div className="flex h-full w-[100%] items-start justify-center gap-4">
        <div className="flex h-[500px] min-h-[30rem] gap-4">
          <div className="h-fit w-[30%]">
            <div className="my-4 flex items-center justify-between pr-4">
              <h1 className="font-semibold">
                Place your student ID to get scan
              </h1>
              <CircleHelp className="block" size={30} />
            </div>
            <Scanner
              allowMultiple={false}
              onScan={(result: IDetectedBarcode[]) => {
                console.log('Student ID:', result[0].rawValue);

                fetchStudentData(result[0].rawValue);
                fetchAttendanceForTimeout(result[0].rawValue);

                handleTimeOut(result[0].rawValue);
              }}
            />

            <Label className="my-4 block">
              Scan not working?{' '}
              <span
                className="my-2 block cursor-pointer underline"
                onClick={() => {
                  console.log('Show Manual Input');
                  setShowManualInput(!showManualInput);
                }}
              >
                {showManualInput
                  ? 'Hide Manual Input'
                  : 'Click here to manually input student ID.'}
              </span>
            </Label>

            {showManualInput && (
              <div className="w-full">
                <Label>Enter Student ID</Label>
                <Input
                  placeholder="Enter Student ID"
                  onChange={(e) => setStudentID(e.target.value)}
                />

                <div className="my-2 flex w-full justify-end">
                  <Button
                    onClick={() => {
                      if (studentID.length > 0) {
                        fetchStudentData(studentID);
                        handleTimeOut(studentID);
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid h-full w-[80%] grid-cols-2 gap-4">
            {student.student_id_code?.length > 0 ? (
              <div className="flex h-full w-full flex-col items-center border-orange-600">
                <h1 className="my-5 w-full text-start font-semibold">
                  Student Information
                </h1>
                <div className="flex w-full items-center gap-4">
                  <img
                    className="h-[20rem] w-[15rem] rounded-xl object-cover"
                    src={
                      student.student_image_path?.length > 0
                        ? `${import.meta.env.VITE_SERVER_LINK}/${student.student_image_path}`
                        : ProfileDefault
                    }
                    alt="Student Image"
                  />
                  <div>
                    <span>
                      <Label>Student Name:</Label>
                      <p className="font-bold">{student.student_name}</p>
                    </span>
                    <span>
                      <Label>Grade Level:</Label>
                      <p className="font-bold">{student.student_grade_level}</p>
                    </span>

                    <span>
                      <Label>Block Section: </Label>
                      <p className="font-bold">
                        {student.student_block_section}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[1px] px-4 text-center">
                <QrCode size={50} />
                <h1 className="text-2xl font-bold"> No Scan Student Data</h1>
                <span className="inline-block">
                  Scan a student ID to view their information and automatically
                  set their time in.
                </span>
              </div>
            )}

            <div className="h-full w-full rounded-xl border-[1px] px-2">
              <h1 className="my-5 font-semibold">Todays Entries</h1>

              <div>
                <Table>
                  <TableCaption>A list of todays attendance.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Time Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[12px]">
                    {currentItems.map((entry, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-sm font-medium">
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
              </div>
              <PaginationTemplate
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeOut;
