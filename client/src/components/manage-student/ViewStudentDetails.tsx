import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Label } from '../ui/label';

interface Student {
  student_id: string;
  student_id_code: string;
  student_image_path: string;
  student_firstname: string;
  student_lastname: string;
  student_name: string;
  student_middlename: string;
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

const ViewStudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student>({} as Student);
  const [image, setImage] = useState<string | null>(null);

  const fetchStudentData = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_LINK}/student.php`, {
        params: {
          student_id: id,
        },
      })
      .then((res) => {
        console.log(res.data, 'sss');
        setStudent(res.data[0]);
        setImage(res.data[0].student_image_path);
      });
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="h-full w-full">
      <h1 className="my-4 text-6xl font-bold">View Student Details</h1>

      <div className="my-4">
        <div className="flex justify-start gap-4">
          <div className="flex flex-col items-center">
            <img
              src={`${import.meta.env.VITE_SERVER_LINK}/${student.student_image_path}`}
              alt="student"
              className="h-[15rem] w-[15rem] object-cover shadow-lg"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="my-4 text-2xl font-semibold">Basic Information</h1>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Fullname</Label>
                <h1 className="text-xl">{student.student_name}</h1>
              </div>
              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Date of Birth</Label>
                <h1 className="text-xl">{student.student_datebirth}</h1>
              </div>

              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Addres</Label>
                <h1 className="text-xl">{student.student_address}</h1>
              </div>

              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Gender</Label>
                <h1 className="text-xl">{student.student_gender}</h1>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="my-4 text-2xl font-semibold">
                Program Information
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Program</Label>
                  <h1 className="text-xl">{student.student_program}</h1>
                </div>
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Grade Level</Label>
                  <h1 className="text-xl">{student.student_grade_level}</h1>
                </div>

                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Block / Section</Label>
                  <h1 className="text-xl">{student.student_block_section}</h1>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="my-4 text-2xl font-semibold">
                Contact Information
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Parent/Guardian Name</Label>
                  <h1 className="text-xl">{student.student_parent_name}</h1>
                </div>
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Parent/Guardian Phone Number(s)</Label>
                  <h1 className="text-xl">{student.student_parent_number}</h1>
                </div>

                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Parent/Guardian Email Address</Label>
                  <h1 className="text-xl">{student.student_block_section}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentDetails;
