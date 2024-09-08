import { Student } from '@/types/student';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Label } from '../ui/label';

const ViewStudentDetails = () => {
  const { id } = useParams<{ id: string }>();

  const fetcher = async (url: string): Promise<{}[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/student/${id}`,
    fetcher,
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const student =
    data && data.length > 0 ? (data[0] as Student) : ({} as Student);

  return (
    <div className="h-full w-full">
      <h1 className="my-4 text-6xl font-bold">Student Details</h1>

      <div className="my-4">
        <div className="flex justify-start gap-8">
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
                <h1 className="text-xl font-semibold">
                  {student.student_name}
                </h1>
              </div>
              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Date of Birth</Label>
                <h1 className="text-xl font-semibold">
                  {student.student_datebirth}
                </h1>
              </div>

              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Addres</Label>
                <h1 className="text-xl font-semibold">
                  {student.student_address}
                </h1>
              </div>

              <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                <Label>Gender</Label>
                <h1 className="text-xl font-semibold">
                  {student.student_gender}
                </h1>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="my-4 text-2xl font-semibold">
                Program Information
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Program</Label>
                  <h1 className="text-xl font-semibold">
                    {student.student_program}
                  </h1>
                </div>
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Grade Level</Label>
                  <h1 className="text-xl font-semibold">
                    {student.student_grade_level}
                  </h1>
                </div>

                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Block / Section</Label>
                  <h1 className="text-xl font-semibold">
                    {student.student_block_section}
                  </h1>
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
                  <h1 className="text-xl font-semibold">
                    {student.student_parent_name}
                  </h1>
                </div>
                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Parent/Guardian Phone Number(s)</Label>
                  <h1 className="text-xl font-semibold">
                    {student.student_parent_number}
                  </h1>
                </div>

                <div className="h-fit w-[20rem] rounded-md border-b-[1px] p-2 shadow-sm">
                  <Label>Parent/Guardian Email Address</Label>
                  <h1 className="text-xl font-semibold">
                    {student.student_block_section}
                  </h1>
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
