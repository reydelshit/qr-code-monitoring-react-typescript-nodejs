import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileDefault from '@/assets/profile.webp';
import { IBoundingBox, IPoint, Scanner } from '@yudiel/react-qr-scanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useSWR from 'swr';
import moment from 'moment';
import { Label } from '@/components/ui/label';

interface IDetectedBarcode {
  boundingBox: IBoundingBox;
  cornerPoints: IPoint[];
  format: string;
  rawValue: string;
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
            <TabsTrigger className="h-[4rem] w-[10rem]" value="In">
              Time In
            </TabsTrigger>
            <TabsTrigger className="h-[4rem] w-[10rem]" value="Out">
              Time Out
            </TabsTrigger>
          </TabsList>
          <TabsContent value="In">
            <div className="flex h-full w-[100%] items-start justify-center gap-4">
              {/* <img className="w-[20%]" src={ProfileDefault} alt="Student Image" /> */}

              <div className="w-[30%] bg-orange-500">
                <Scanner
                  allowMultiple={true}
                  onScan={(result: IDetectedBarcode[]) => {
                    // console.log(result);
                    // setStudentID(result[0].rawValue);

                    console.log('Student ID:', result[0].rawValue);

                    fetchStudentData(result[0].rawValue);
                    handleTimeIn(result[0].rawValue);
                  }}
                />
              </div>

              <div className="grid h-full w-[80%] grid-cols-2 border-2">
                {student.student_id_code?.length > 0 ? (
                  <div className="flex w-full flex-col items-center border-2">
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

                <div className="w-full">table here</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Out">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanStation;
