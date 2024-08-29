import AddStudent from '@/components/manage-student/AddStudent';
import EditStudent from '@/components/manage-student/EditStudent';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student } from '@/types/student';
import axios from 'axios';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const StudentManagement = () => {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [studentID, setStudentID] = useState('');

  const fetcher = async (url: string): Promise<Student[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const {
    data: students,
    error,
    isLoading,
  } = useSWR(`${import.meta.env.VITE_SERVER_LINK}/student`, fetcher);

  console.log(students);

  const handleDelete = (student_id: string) => {
    axios
      .delete(`${import.meta.env.VITE_SERVER_LINK}/student`, {
        data: {
          student_id,
        },
      })
      .then((res) => {
        console.log(res.data);
        // fetchStudents();
      });
  };

  const handleEdit = (student_id: string) => {
    setStudentID(student_id);
    setShowEditForm(true);
  };

  //   fetchStudents();
  // }, []);

  return (
    <div className="relative h-full w-full">
      <h1 className="my-4 text-6xl font-bold">Student Management</h1>
      <div className="h-full w-full">
        <div className="flex justify-end p-2">
          <Button
            onClick={() => {
              setShowStudentForm(true);
              console.log('clicked');
            }}
            className="bg-green-500 text-white"
          >
            Create Student
          </Button>
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

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
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      className="h-[4rem] w-[4rem] object-cover"
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
                  <TableCell>{student.student_datebirth}</TableCell>
                  <TableCell>{student.student_address}</TableCell>
                  <TableCell>{student.student_gender}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button className="bg-green-500 text-white">
                        <Link to={`/StudentManagement/${student.student_id}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        onClick={() => {
                          handleEdit(student.student_id);
                        }}
                        className="bg-blue-500 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          handleDelete(student.student_id);
                        }}
                        className="bg-red-500 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {showStudentForm && (
        <div className="absolute top-0 flex w-full max-w-[100%] items-center justify-center bg-white bg-opacity-80">
          <AddStudent setShowStudentForm={setShowStudentForm} />
        </div>
      )}

      {showEditForm && (
        <div className="absolute top-0 flex w-full max-w-[100%] items-center justify-center bg-white bg-opacity-80">
          <EditStudent
            setShowEditForm={setShowEditForm}
            studentID={studentID}
          />
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
