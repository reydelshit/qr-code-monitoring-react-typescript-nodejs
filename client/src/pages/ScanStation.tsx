import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useEffect, useState } from 'react';

import ReactiveTime from '@/components/ReactiveTime';
import TimeIn from '@/components/scan-station/TimeIn';
import TimeOut from '@/components/scan-station/TimeOut';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Attendance, Student } from '@/types/scan-station';
import { AlarmClock } from 'lucide-react';
import moment from 'moment';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const ScanStation = () => {
  const [studentID, setStudentID] = useState('');
  const [student, setStudent] = useState<Student>({} as Student);
  const [attendanceForTimeout, setAttendanceForTimeout] = useState<
    Attendance[]
  >([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const { toast } = useToast();
  const [timeNow, setTimeNow] = useState(
    moment().format('YYYY-MM-DD HH:mm:ss'),
  );

  const path = useLocation().pathname;

  const apiKey =
    '_A9QaZDJewc0TKL8sEUsNFoqOCbKT-a6zopzW2Dy30XZ1YnE1MwtmTPYQloPIyvH';
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

  useEffect(() => {
    console.log(attendance);
    setTimeNow(moment().format('YYYY-MM-DD HH:mm:ss'));
  }, [timeNow]);

  const sendMessageToParents = (student_details: Student, type: string) => {
    const message = `Good day, ${student_details.student_parent_name}. Your student, ${student_details.student_name}, has ${type} the school on ${moment().format(
      'LLLL',
    )}.`;

    uploadMessageToDatabase({
      student_id: student_details.student_id_code,
      content: message,
      dateSent: moment().format('LLLL'),
      recepientNumber: student_details.student_parent_number,
    });

    return fetch('https://api.httpsms.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        from: '+639097134971',
        // to: `${student.student_parent_number}`,
        to: '+639097134971',
      }),
    });
  };

  const fetchStudentData = async (
    student_id: string,
    type: string,
  ): Promise<Student[]> => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/student/scan/${student_id}`,
      );
      console.log(res.data, 'Student Data');
      setStudent(res.data[0]);

      if (type === 'time-in') {
        handleTimeIn(student_id, res.data[0]);
      } else {
        handleTimeOut(student_id, res.data[0]);
      }

      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleTimeIn = async (student_id: string, student_details: Student) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/attendance/create/time-in`,
        {
          student_id_code: student_id,
          timeIn: moment().format('YYYY-MM-DD HH:mm:ss'),
          timeOut: 'n/a',
          created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      );

      console.log(student);
      if (res.data.status === 'success') {
        sendMessageToParents(student_details, 'ENTERED')
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 'success') {
              console.log(data);
              setTimeout(() => {
                setStudent({} as Student);
              }, 6000);
              mutate();
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadMessageToDatabase = async (
    { student_id, content, dateSent, recepientNumber } = {} as {
      student_id: string;
      content: string;
      dateSent: string;
      recepientNumber: string;
    },
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/messages/upload-message`,
        {
          student_id,
          content,
          dateSent,
          recepientNumber,
        },
      );

      if (res.data.status === 'success') {
        console.log('Message uploaded successfully');
      }
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

  const handleTimeOut = async (
    student_id: string,
    student_details: Student,
  ) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_LINK}/attendance/update/time-out`,
        {
          student_id_code: student_id,
          timeOut: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      );

      if (res.data.affectedRows > 0) {
        mutate();
        setTimeout(() => {
          setStudent({} as Student);
        }, 6000);
      } else {
        toast({
          title: 'Error',
          description:
            'There was an error updating the time out. Maybe the student has not yet time in or the time out has already been set.',
          variant: 'destructive',
        });
      }

      if (res.data.status === 'success') {
        sendMessageToParents(student_details, 'EXITED')
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 'success') {
              console.log(data);
              setTimeout(() => {
                setStudent({} as Student);
              }, 6000);
              mutate();
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative h-dvh overflow-x-auto px-4">
      <div className="flex items-center justify-between">
        <h1 className="my-4 text-6xl font-bold">Scan Station</h1>

        {path === '/scan' && (
          <Button>
            <Link to={'/login'}>Login</Link>
          </Button>
        )}
      </div>

      <div className="flex h-full w-full flex-col items-center">
        <h1 className="flex w-full items-center justify-end gap-2 px-4 text-end text-2xl font-semibold">
          <AlarmClock size={30} /> <ReactiveTime />
        </h1>

        <Tabs
          defaultValue="In"
          className="my-[2rem] flex h-full w-full flex-col"
        >
          <TabsList className="h-[4rem]">
            <TabsTrigger
              onClick={() => {
                setStudent({} as Student);
              }}
              className="h-[90%] w-[10rem]"
              value="In"
            >
              Time In
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setStudent({} as Student);
              }}
              className="h-[90%] w-[10rem]"
              value="Out"
            >
              Time Out
            </TabsTrigger>
          </TabsList>
          <TabsContent value="In">
            <TimeIn
              student={student}
              studentID={studentID}
              setStudentID={setStudentID}
              fetchStudentData={fetchStudentData}
              // handleTimeIn={handleTimeIn}
              attendance={attendance === undefined ? [] : attendance}
              showManualInput={showManualInput}
              setShowManualInput={setShowManualInput}
            />
          </TabsContent>
          <TabsContent value="Out">
            <TimeOut
              attendance={attendance === undefined ? [] : attendance}
              student={student}
              studentID={studentID}
              setStudentID={setStudentID}
              // handleTimeOut={handleTimeOut}
              fetchStudentData={fetchStudentData}
              fetchAttendanceForTimeout={fetchAttendanceForTimeout}
              showManualInput={showManualInput}
              setShowManualInput={setShowManualInput}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanStation;
