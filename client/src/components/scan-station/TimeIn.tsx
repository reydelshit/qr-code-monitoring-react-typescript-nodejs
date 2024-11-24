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
import { Link } from 'react-router-dom';
import { toast } from '../ui/use-toast';
import CryptoJS from 'crypto-js';

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

  const verifySignature = (data: string, signature: string) => {
    const secretKey = import.meta.env.VITE_SIGNEDKEY;
    // const secretKey = 'test';

    const computedSignature = CryptoJS.HmacSHA256(data, secretKey).toString(
      CryptoJS.enc.Base64,
    );

    return computedSignature === signature;
  };

  return (
    <div className="flex h-full w-[100%] items-start justify-center gap-4">
      <div className="flex h-[500px] min-h-[30rem] flex-col gap-4 md:flex-row">
        <div className="mx-2 block h-fit w-full md:w-[30%]">
          <div className="flex items-center justify-between p-2 md:my-4 md:pr-4">
            <h1 className="font-semibold">
              Place your student ID to be scanned.
            </h1>
            <Link to="/help">
              <CircleHelp size={30} />
            </Link>
          </div>
          <div>
            <Scanner
              allowMultiple={false}
              onScan={(result: IDetectedBarcode[]) => {
                // if (!result || result.length === 0) {
                //   console.warn('No barcode detected.');
                //   return;
                // }

                // const studentId = result[0].rawValue;
                // console.log('Student ID:', studentId);

                // try {
                //   fetchStudentData(studentId, 'time-in');

                //   // handleTimeIn(studentId);
                // } catch (error) {
                //   console.error('Error fetching student data:', error);
                // }

                if (!result || result.length === 0) {
                  console.warn('No barcode detected.');
                  return;
                }

                const scannedQR = result[0].rawValue;
                console.log('Scanned QR Code:', scannedQR);

                try {
                  const parsedData = JSON.parse(scannedQR);

                  const { data, signature } = parsedData;
                  const isValid = verifySignature(data, signature);

                  if (!isValid) {
                    toast({
                      title: 'Invalid QR Code',
                      description:
                        'The QR code signature is invalid or tampered.',
                      variant: 'destructive',
                    });
                    return;
                  }

                  toast({
                    title: 'QR Code Valid',
                    description: 'QR code successfully scanned.',
                  });
                  fetchStudentData(data, 'time-in');
                } catch (error) {
                  console.error('Error processing the QR code:', error);
                }
              }}
            />
          </div>

          <Label className="my-4 block md:h-fit">
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

        <div className="flex h-full w-full flex-col gap-2 md:w-[80%] md:flex-row md:gap-4">
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
            <div className="flex h-[50rem] w-full flex-col items-center justify-center rounded-xl border-[1px] px-4 text-center md:h-full">
              <QrCode size={50} />
              <h1 className="text-2xl font-bold"> No Student Scanned</h1>
              <span className="inline-block">
                Please Scan a Student ID to Display Details and Set Time In.
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
                <Link to="/attendance-log" className="flex">
                  {' '}
                  See more <ChartNoAxesGantt />
                </Link>
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
