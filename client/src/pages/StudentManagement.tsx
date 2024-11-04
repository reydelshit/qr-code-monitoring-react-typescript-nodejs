import AddStudent from '@/components/manage-student/AddStudent';
import EditStudent from '@/components/manage-student/EditStudent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import PaginationTemplate from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import usePagination from '@/hooks/usePagination';
import { Student } from '@/types/student';
import axios from 'axios';
import { UserRoundPen, UserRoundSearch, UserX } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const StudentManagement = () => {
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
      itemsPerPage: 10,
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
      .catch(() => {
        toast({
          title: 'Error',
          description: 'An error occurred while adding the student.',
          variant: 'destructive',
        });
      });
  };

  const handleEdit = (student_id: string) => {
    setStudentID(student_id);
  };

  return (
    <div className="relative h-full w-full">
      <h1 className="my-4 text-6xl font-bold">Manage Student</h1>
      <div className="mt-[2rem] h-full w-full">
        <div className="flex w-full justify-between p-2">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            className="w-[20rem]"
            placeholder="Search student.."
          />

          <Dialog>
            <DialogTrigger>
              <Button className="w-[240px] rounded-lg">Create Student</Button>
            </DialogTrigger>
            <DialogContent className="h-[95%] w-[70%]">
              <DialogHeader>
                <div className="hidden">
                  <DialogTitle>Register student</DialogTitle>
                  <DialogDescription>
                    Fill in the form to register a new student
                  </DialogDescription>
                </div>
              </DialogHeader>
              <AddStudent mutate={mutate} />
            </DialogContent>
          </Dialog>
          {/* 
          <Button
            onClick={() => {
              setShowStudentForm(true);
              console.log('clicked');
            }}
          >
            Create Student
          </Button> */}
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <div className="mx-2 mt-2 flex justify-between">
          <p className="text-sm">
            Showing {currentItems.length} of {students.length} students.
          </p>
          <p className="text-sm">
            {currentItems.length} number of students registed in the system.
          </p>
        </div>
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
                  <TableCell className="mx-auto grid place-items-center text-center">
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

                    <span className="font-semibold">
                      {' '}
                      {student.student_id_code}
                    </span>
                  </TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.student_datebirth}</TableCell>
                  <TableCell>{student.student_address}</TableCell>
                  <TableCell>{student.student_gender}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button className="">
                        <Link
                          className="flex gap-1"
                          to={`/student-management/${student.student_id}`}
                        >
                          <UserRoundSearch size={20} /> View
                        </Link>
                      </Button>

                      <Dialog>
                        <DialogTrigger>
                          {' '}
                          <Button
                            onClick={() => {
                              handleEdit(student.student_id);
                            }}
                            className="flex gap-1"
                          >
                            <UserRoundPen size={20} /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="h-[95%] w-[70%]">
                          <DialogHeader>
                            <div className="hidden">
                              <DialogTitle>Edit student details</DialogTitle>
                              <DialogDescription>
                                Fill in the form to edit student details
                              </DialogDescription>
                            </div>
                          </DialogHeader>
                          <EditStudent mutate={mutate} studentID={studentID} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => {
                          handleDelete(student.student_id);
                        }}
                        className="flex gap-1 bg-red-500 text-white"
                      >
                        <UserX size={20} /> Delete
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

      {/* {showStudentForm && (
        <div className="absolute top-0 flex w-full max-w-[100%] items-center justify-center bg-white bg-opacity-80">
        </div>
      )} */}
      {/* 
      {showEditForm && (
        <div className="absolute top-0 flex w-full max-w-[100%] items-center justify-center bg-white bg-opacity-80">
          <EditStudent
            mutate={mutate}
            setShowEditForm={setShowEditForm}
            studentID={studentID}
          />
        </div>
      )} */}
    </div>
  );
};

export default StudentManagement;
