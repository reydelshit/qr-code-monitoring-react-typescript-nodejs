import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileDefault from '@/assets/profile.webp';
import { IBoundingBox, IPoint, Scanner } from '@yudiel/react-qr-scanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface IDetectedBarcode {
  boundingBox: IBoundingBox;
  cornerPoints: IPoint[];
  format: string;
  rawValue: string;
}

interface Attendance {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}

interface Student {
  student_id: string;
  student_id_code: string;
  student_image_path: string;
  student_name: string;
  student_datebirth: string;
  student_grade_level: string;
  student_program: string;
  student_block_section: string;
  student_parent_name: string;
  student_parent_number: string;
  student_parent_email: string;
  student_address: string;
  student_gender: string;
}

const ScanStation = () => {
  const [studentID, setStudentID] = useState('');
  const [student, setStudent] = useState<Student>({} as Student);
  const [attendanceForTimeout, setAttendanceForTimeout] = useState<
    Attendance[]
  >([]);
  const [showManualInput, setShowManualInput] = useState(false);

  const fetcher = async (url: string): Promise<Attendance[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const {
    data: attendance,
    error,
    isLoading,
    mutate,
  } = useSWR(`${import.meta.env.VITE_SERVER_LINK}/attendance`, fetcher);

  const fetchStudentData = async (student_id: string) => {
    try {
      await axios
        .get(`${import.meta.env.VITE_SERVER_LINK}/student/scan/${student_id}`)
        .then((res) => {
          console.log(res.data, 'Student Data');
          setStudent(res.data[0]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTimeIn = async (student_id: string) => {
    try {
      await axios
        .post(`${import.meta.env.VITE_SERVER_LINK}/attendance/create`, {
          student_id_code: student_id,
          timeIn: moment().format('YYYY-MM-DD HH:mm:ss'),
          timeOut: 'n/a',
          created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .then((res) => {
          console.log(res.data, 'Student Data');
          // setStudent(res.data[0]);

          if (res.data.status === 'success') {
            mutate();
            setTimeout(() => {
              setStudent({} as Student);
            }, 6000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAttendanceForTimeout = async (student_id: string) => {
    try {
      await axios
        .get(`${import.meta.env.VITE_SERVER_LINK}/attendance/${student_id}`)
        .then((res) => {
          console.log(res.data, 'Attendance Data');
          setAttendanceForTimeout(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTimeOut = async (student_id: string) => {
    try {
      await axios
        .put(`${import.meta.env.VITE_SERVER_LINK}/attendance/update`, {
          student_id_code: student_id,
          timeOut: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .then((res) => {
          console.log(res.data, 'Student Data');
          // setStudent(res.data[0]);

          if (res.data.affectedRows > 0) {
            mutate();
            setTimeout(() => {
              setStudent({} as Student);
            }, 6000);
          } else {
            console.log(
              'there was an error updating the time out. maybe the student has not yet time in.',
            );
          }

          if (res.data.status === 'success') {
            mutate();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative h-full">
      <h1 className="my-4 text-6xl font-bold">Scan Station</h1>

      <div className="flex h-full w-full flex-col items-center border-2">
        <h1 className="mt-[2rem] w-full px-4 text-end text-2xl font-bold">
          {moment().format('LLLL')}
        </h1>

        <Tabs
          defaultValue="In"
          className="my-[2rem] flex w-full flex-col justify-center border-2"
        >
          <TabsList className="h-[4rem]">
            <TabsTrigger
              onClick={() => {
                setStudent({} as Student);
              }}
              className="h-[4rem] w-[10rem]"
              value="In"
            >
              Time In
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setStudent({} as Student);
              }}
              className="h-[4rem] w-[10rem]"
              value="Out"
            >
              Time Out
            </TabsTrigger>
          </TabsList>
          <TabsContent value="In">
            <div className="flex h-full w-[100%] items-start justify-center gap-4">
              {/* <img className="w-[20%]" src={ProfileDefault} alt="Student Image" /> */}

              <div className="w-[30%]">
                <Scanner
                  allowMultiple={false}
                  onScan={(result: IDetectedBarcode[]) => {
                    // console.log(result);
                    // setStudentID(result[0].rawValue);

                    console.log('Student ID:', result[0].rawValue);

                    fetchStudentData(result[0].rawValue);
                    handleTimeIn(result[0].rawValue);
                  }}
                />

                <Button
                  onClick={() => {
                    console.log('Show Manual Input');
                    setShowManualInput(!showManualInput);
                  }}
                  className="z-10 my-2"
                >
                  {showManualInput
                    ? 'Hide Manual Input'
                    : ' Scan not working? Click here to manually input student ID.'}
                </Button>

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
                            handleTimeIn(studentID);
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid h-full w-[80%] grid-cols-2 border-2">
                {student.student_id_code?.length > 0 ? (
                  <div className="flex w-full flex-col items-center border-2">
                    <h1 className="my-2 w-full text-start font-bold">
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
                          <p className="font-bold">
                            {student.student_grade_level}
                          </p>
                        </span>

                        <span>
                          <Label>Block Section: </Label>
                          <p className="font-bold">
                            {student.student_block_section}
                          </p>
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full justify-end border-2 px-4">
                      {student && student.student_name?.length > 0 && (
                        <Button
                          className="my-5"
                          onClick={() => {
                            console.log(student.student_id_code);
                          }}
                        >
                          Time In
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center justify-center border-2">
                    No Scan Student Data
                    <span className="inline-block">
                      Scan a student ID to view their information and set their
                      time in.
                    </span>
                  </div>
                )}

                <div className="w-full">
                  <h1 className="my-2 font-bold">Todays Entries</h1>

                  <div>
                    <Table>
                      <TableCaption>A list of recent attendance.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Time In</TableHead>
                          <TableHead>Time Out</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance?.map((entry, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {entry.student_id_code}
                              </TableCell>
                              <TableCell>
                                {moment(entry.timeIn).format('LLLL')}
                              </TableCell>
                              <TableCell>
                                {entry.timeOut === 'n/a'
                                  ? 'Not yet set'
                                  : moment(entry.timeOut).format('LLLL')}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Out">
            <div className="flex h-full w-[100%] items-start justify-center gap-4">
              {/* <img className="w-[20%]" src={ProfileDefault} alt="Student Image" /> */}

              <div className="w-[30%]">
                <Scanner
                  allowMultiple={false}
                  onScan={(result: IDetectedBarcode[]) => {
                    // console.log(result);
                    // setStudentID(result[0].rawValue);

                    console.log('Student ID:', result[0].rawValue);

                    fetchStudentData(result[0].rawValue);
                    fetchAttendanceForTimeout(result[0].rawValue);

                    handleTimeOut(result[0].rawValue);
                  }}
                />

                <Button
                  onClick={() => {
                    console.log('Show Manual Input');
                    setShowManualInput(!showManualInput);
                  }}
                  className="z-10 my-2"
                >
                  {showManualInput
                    ? 'Hide Manual Input'
                    : ' Scan not working? Click here to manually input student ID.'}
                </Button>

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

              <div className="grid h-full w-[80%] grid-cols-2 border-2">
                {student.student_id_code?.length > 0 ? (
                  <div className="flex w-full flex-col items-center border-2">
                    <h1 className="my-2 w-full text-start font-bold">
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
                          <p className="font-bold">
                            {student.student_grade_level}
                          </p>
                        </span>

                        <span>
                          <Label>Block Section: </Label>
                          <p className="font-bold">
                            {student.student_block_section}
                          </p>
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full justify-end border-2 px-4">
                      {student && student.student_name?.length > 0 && (
                        <Button
                          className="my-5"
                          onClick={() => {
                            console.log(student.student_id_code);
                          }}
                        >
                          Time Out
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center justify-center border-2">
                    No Scan Student Data
                    <span className="inline-block">
                      Scan a student ID to view their information and set their
                      time in.
                    </span>
                  </div>
                )}

                <div className="w-full">
                  <h1 className="my-2 font-bold">Todays Entries</h1>

                  <div>
                    <Table>
                      <TableCaption>A list of recent attendance.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Time In</TableHead>
                          <TableHead>Time Out</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance?.map((entry, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {entry.student_id_code}
                              </TableCell>
                              <TableCell>
                                {moment(entry.timeIn).format('LLLL')}
                              </TableCell>
                              <TableCell>
                                {entry.timeOut === 'n/a'
                                  ? 'Not yet set'
                                  : moment(entry.timeOut).format('LLLL')}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanStation;
