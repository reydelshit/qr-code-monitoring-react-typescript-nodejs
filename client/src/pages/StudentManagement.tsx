import AddStudent from '@/components/manage-student/AddStudent';
import EditStudent from '@/components/manage-student/EditStudent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import usePagination from '@/hooks/usePagination';
import PaginationTemplate from '@/components/Pagination';
import { Input } from '@/components/ui/input';

const StudentManagement = () => {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [studentID, setStudentID] = useState('');
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const fetcher = async (url: string): Promise<Student[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const {
    data: students = [],
    error,
    isLoading,
    mutate,
  } = useSWR(`${import.meta.env.VITE_SERVER_LINK}/student`, fetcher);

  const filteredStudents = students.filter((student) => {
    return (
      student.student_name.toLowerCase().includes(search.toLowerCase()) ||
      student.student_id_code.toLowerCase().includes(search.toLowerCase())
    );
  });

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 1,
      data: filteredStudents,
    });

  const handleDelete = (student_id: string) => {
    axios
      .delete(
        `${import.meta.env.VITE_SERVER_LINK}/student/delete/${student_id}`,
      )
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Student Deleted Successfully',
            description: 'The student has been deleted to the system.',
          });
          mutate();
        }
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: 'An error occurred while adding the student.',
          variant: 'destructive',
        });
      });
  };

  const handleEdit = (student_id: string) => {
    setStudentID(student_id);
    setShowEditForm(true);
  };

  return (
    <div className="relative h-full w-full">
      <h1 className="my-4 text-6xl font-bold">Student Management</h1>
      <div className="mt-[2rem] h-full w-full">
        <div className="flex justify-between p-2">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            className="w-[20rem]"
            placeholder="Search student.."
          />
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
            {currentItems?.map((student, index) => {
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
                        <Link to={`/student-management/${student.student_id}`}>
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
        <PaginationTemplate
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>

      {showStudentForm && (
        <div className="absolute top-0 flex w-full max-w-[100%] items-center justify-center bg-white bg-opacity-80">
          <AddStudent mutate={mutate} setShowStudentForm={setShowStudentForm} />
        </div>
      )}

      {showEditForm && (
        <div className="absolute top-0 flex w-full max-w-[100%] items-center justify-center bg-white bg-opacity-80">
          <EditStudent
            mutate={mutate}
            setShowEditForm={setShowEditForm}
            studentID={studentID}
          />
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
