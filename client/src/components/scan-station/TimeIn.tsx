import ProfileDefault from '@/assets/profile.webp';
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
import { Attendance, IDetectedBarcode, Student } from '@/types/scan-station';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ChartNoAxesGantt, CircleHelp, QrCode } from 'lucide-react';
import moment from 'moment';
import PaginationTemplate from '../Pagination';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TimeInType {
  studentID: string;
  setStudentID: (studentID: string) => void;
  student: Student;
  fetchStudentData: (studentID: string, type: string) => void;
  attendance: Attendance[];
  // handleTimeIn: (studentID: string) => void;
  showManualInput: boolean;
  setShowManualInput: (showManualInput: boolean) => void;
}

const TimeIn: React.FC<TimeInType> = ({
  studentID,
  setStudentID,
  student,
  fetchStudentData,
  attendance,
  // handleTimeIn,
  showManualInput,
  setShowManualInput,
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
    <div className="flex h-full w-[100%] items-start justify-center gap-4">
      <div className="flex h-[500px] min-h-[30rem] gap-4">
        <div className="h-fit w-[30%]">
          <div className="my-4 flex items-center justify-between pr-4">
            <h1 className="font-semibold">Place your student ID to get scan</h1>
            <CircleHelp className="block" size={30} />
          </div>
          <Scanner
            allowMultiple={false}
            onScan={(result: IDetectedBarcode[]) => {
              if (!result || result.length === 0) {
                console.warn('No barcode detected.');
                return;
              }

              const studentId = result[0].rawValue;
              console.log('Student ID:', studentId);

              try {
                fetchStudentData(studentId, 'time-in');

                // handleTimeIn(studentId);
              } catch (error) {
                console.error('Error fetching student data:', error);
              }
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
                      fetchStudentData(studentID, 'time-in');
                      // handleTimeIn(studentID);
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
                    <p className="font-bold">{student.student_block_section}</p>
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
            <div className="my-5 flex items-center justify-between">
              <span>
                <h1 className="font-semibold">Today's Attendance</h1>
                <span className="text-[12px]">
                  {filteredAttendance?.length} students attended today.
                </span>
              </span>

              <span className="flex flex-col font-medium">
                <p className="flex">
                  {' '}
                  See more <ChartNoAxesGantt />
                </p>
              </span>
            </div>

            <div>
              <p className="text-[12px] font-semibold">
                Only shows 10 per page
              </p>
              <Table>
                <TableCaption>A list of todays attendance.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead className="w-[100px]">Student ID</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="h-[1rem] text-[12px]">
                  {currentItems.map((entry, index) => {
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
  );
};

export default TimeIn;
