import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useEffect, useState } from 'react';

import TimeIn from '@/components/scan-station/TimeIn';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';
import useSWR from 'swr';
import TimeOut from '@/components/scan-station/TimeOut';
import { Attendance } from '@/types/scan-station';
import { Student } from '@/types/scan-station';
import usePagination from '@/hooks/usePagination';

const ScanStation = () => {
  const [studentID, setStudentID] = useState('');
  const [student, setStudent] = useState<Student>({} as Student);
  const [attendanceForTimeout, setAttendanceForTimeout] = useState<
    Attendance[]
  >([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const { toast } = useToast();

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
  }, [attendance]);

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
        .post(`${import.meta.env.VITE_SERVER_LINK}/attendance/create/time-in`, {
          student_id_code: student_id,
          timeIn: moment().format('YYYY-MM-DD HH:mm:ss'),
          timeOut: 'n/a',
          created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .then((res) => {
          console.log(res.data, 'Student Data');

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
        .put(`${import.meta.env.VITE_SERVER_LINK}/attendance/update/time-out`, {
          student_id_code: student_id,
          timeOut: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .then((res) => {
          console.log(res.data, 'Student Data');

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
            mutate();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative h-dvh overflow-x-auto">
      <h1 className="my-4 text-6xl font-bold">Scan Station</h1>

      <div className="flex h-full w-full flex-col items-center">
        <h1 className="w-full px-4 text-end text-2xl font-bold">
          {moment().format('LLLL')}
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
              handleTimeIn={handleTimeIn}
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
              fetchStudentData={fetchStudentData}
              handleTimeOut={handleTimeOut}
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
