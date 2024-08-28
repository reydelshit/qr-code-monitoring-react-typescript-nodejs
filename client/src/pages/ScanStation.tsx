import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import StudentsTable from '../components/scan-station/StudentsTable';

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
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = () => {
    axios.get(`${import.meta.env.VITE_SERVER_LINK}/student.php`).then((res) => {
      console.log(res.data);
      setStudents(res.data);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
  };
  return (
    <div className="relative h-full">
      <h1 className="my-4 text-6xl font-bold">Scan Station</h1>

      <div className="mb-2 mt-[2rem] grid w-full grid-cols-4 gap-2">
        <AlertDialog>
          <AlertDialogTrigger>
            {' '}
            <div className="flex h-[10rem] w-[18rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-[1px] border-dashed border-gray-500 text-8xl font-thin hover:bg-gray-100">
              <span className="mt-[-1rem]"> +</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Event</AlertDialogTitle>
              <AlertDialogDescription>
                <div>
                  <form
                    className="w-full px-4 text-start"
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <Label>Event Name (Optional)</Label>
                      <Input />
                    </div>

                    <div>
                      <Label>Date</Label>
                      <Input />
                    </div>

                    <div className="max-h-[20rem] overflow-y-scroll">
                      <h1>Students</h1>
                      {/* <Table className="my-4 w-full text-sm">
                        <TableCaption>
                          A list of registered students.
                        </TableCaption>
                        <TableHeader>
                          <TableRow className="text-sm">
                            <TableHead></TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Fullname</TableHead>
                            <TableHead>Program w/Level</TableHead>
                            <TableHead>Block/Section</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <img
                                  className="h-[3rem] w-[3rem] object-cover"
                                  src={`${import.meta.env.VITE_SERVER_LINK}/${student.student_image_path}`}
                                  alt="student"
                                />
                              </TableCell>
                              <TableCell>
                                <div>
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
                                </div>
                                {student.student_id_code}
                              </TableCell>
                              <TableCell>{student.student_name}</TableCell>
                              <TableCell>
                                {student.student_program} -
                                {student.student_grade_level}
                              </TableCell>
                              <TableCell>
                                {student.student_block_section}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table> */}
                      <StudentsTable />
                    </div>
                  </form>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex h-[10rem] w-[18rem] cursor-pointer flex-col justify-between rounded-2xl border-[1px] border-green-500 p-4">
          <h1 className="text-xl font-semibold text-green-500">
            PSITS EVENT REGISTRATION
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm">August 14, 2024</p>

            <p className="text-sm font-thin">
              <span className="text-[2rem] font-bold">5</span> entries{' '}
            </p>
          </div>
        </div>
        <div className="flex h-[10rem] w-[18rem] cursor-pointer flex-col justify-between rounded-2xl border-[1px] border-yellow-500 p-4">
          <h1 className="text-xl font-semibold text-yellow-500">
            MORNING ATTENDANCE 8AM - 12PM
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm">August 14, 2024</p>

            <p className="text-sm font-thin">
              <span className="text-[2rem] font-bold">5</span> entries{' '}
            </p>
          </div>
        </div>{' '}
        <div className="flex h-[10rem] w-[18rem] cursor-pointer flex-col justify-between rounded-2xl border-[1px] border-red-500 p-4">
          <h1 className="text-xl font-semibold text-red-500">
            MORNING ATTENDANCE 8AM - 12PM
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm">August 14, 2024</p>

            <p className="text-sm font-thin">
              <span className="text-[2rem] font-bold">5</span> entries{' '}
            </p>
          </div>
        </div>
        <div className="flex h-[10rem] w-[18rem] cursor-pointer flex-col justify-between rounded-2xl border-[1px] border-green-500 p-4">
          <h1 className="text-xl font-semibold text-green-500">
            MORNING ATTENDANCE 8AM - 12PM
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm">August 14, 2024</p>

            <p className="text-sm font-thin">
              <span className="text-[2rem] font-bold">5</span> entries{' '}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-4 w-[8rem]">
        <h1 className="rounded-md border-[1px] bg-yellow-500 p-2 text-center text-white">
          ONGOING
        </h1>
        <h1 className="rounded-md border-[1px] bg-green-500 p-2 text-center text-white">
          COMPLETED
        </h1>
        <h1 className="rounded-md border-[1px] bg-red-500 p-2 text-center text-white">
          CANCELLED
        </h1>
      </div>
    </div>
  );
};

export default ScanStation;
