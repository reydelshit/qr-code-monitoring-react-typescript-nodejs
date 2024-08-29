import Lgo from '@/assets/prod.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import defaultProfile from '@/assets/profile.webp';
import useSWR from 'swr';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Student } from '@/types/student';
// import { URL } from 'url';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export default function EditStudent({
  setShowEditForm,
  studentID,
}: {
  setShowEditForm: (value: boolean) => void;
  studentID: string;
}) {
  const [student, setStudent] = useState<Student>({} as Student);
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState('' as string);
  const [selectedGender, setSelectedGender] = useState('' as string);

  const fetcher = async (url: string): Promise<Student[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_SERVER_LINK}/student/${studentID}`,
    fetcher,

    {
      onSuccess: (data: Student[] | undefined) => {
        setStudent(data && data.length > 0 ? data[0] : ({} as Student));

        if (data && data.length > 0) {
          setImage(data[0].student_image_path);
        }

        console.log(data, 'data');
      },
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  // const student =
  //   data && data.length > 0 ? setStudent(data[0] as Student) : ({} as Student);

  // const fetchStudentData = () => {
  //   axios
  //     .get(`${import.meta.env.VITE_SERVER_LINK}/student.php`, {
  //       params: {
  //         student_id: studentID,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data, 'sss');
  //       setStudent(res.data[0]);
  //       setImage(res.data[0].student_image_path);
  //     });
  // };

  // useEffect(() => {
  //   fetchStudentData();
  // }, []);

  const handleGender = (value: string) => {
    console.log(value);
    setSelectedGender(value);
  };

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setStudent((values) => ({ ...values, [name]: value }));
  };
  const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      setErrorField('Please fill in all fields');
      return;
    }

    console.log(student);

    axios
      .put(`${import.meta.env.VITE_SERVER_LINK}/student.php`, {
        ...student,
        student_name: student.student_name,
        student_image_path: image,
        student_gender: student.student_gender || selectedGender,
      })
      .then((res) => {
        console.log(res.data, 'updated');

        if (res.data.status === 'success') {
          window.location.reload();
          setShowEditForm(false);
          toast({
            title: 'product: Added Successfully',
            description: 'product has been added successfully',
          });
        }
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());
      }
    };
  };

  return (
    <div className="relative flex w-[80%] flex-col items-center justify-center rounded-md border-2 bg-white text-center shadow-lg">
      <span
        onClick={() => setShowEditForm(false)}
        className="absolute right-4 top-2 cursor-pointer text-2xl"
      >
        x
      </span>
      <div className="flex w-full flex-col items-center gap-[1rem] p-2">
        <form className="w-full px-4 text-start" onSubmit={handleSubmitUpdate}>
          <div className="flex gap-4">
            <div className="flex w-[25rem] flex-col">
              <img
                className="mb-4 h-[20rem] w-full rounded-lg object-cover"
                src={
                  image!
                    ? `${import.meta.env.VITE_SERVER_LINK}/${student.student_image_path}`
                    : defaultProfile
                }
              />
              <Label className="mb-2 text-start">Student image</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                className="cursor-pointer"
              />

              <div className="mt-4 w-full">
                {' '}
                <QRCode
                  size={15}
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '100%',
                  }}
                  value={student.student_id_code || '0'}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>

            <div className="w-full">
              <Label className="my-2 block text-2xl">Basic Information</Label>
              <div className="flex w-full items-end gap-4">
                <div className="w-full">
                  <Label className="mb-2 text-start">Student ID</Label>
                  <Input
                    name="student_id_code"
                    className="mb-2 w-[100%]"
                    onChange={handleChange}
                    defaultValue={student.student_id_code}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <Label className="mb-2 text-start">Full Name</Label>
                  <Input
                    name="student_name"
                    className="mb-2"
                    onChange={handleChange}
                    defaultValue={student.student_name}
                  />
                </div>
              </div>
              <div className="item-start flex flex-col">
                <Label className="mb-2 text-start">
                  Date of Birth{' '}
                  <span className="font-bold underline">
                    ({student.student_datebirth})
                  </span>
                </Label>
                <Input
                  type="date"
                  name="student_datebirth"
                  className="mb-2"
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <Label className="mb-2 text-start">Address</Label>
                  <Input
                    name="student_address"
                    className="mb-2"
                    onChange={handleChange}
                    defaultValue={student.student_address}
                  />
                </div>

                <div className="mb-[2rem] w-full text-start">
                  <Label className="mb-2">
                    Gender
                    <span>({student.student_gender})</span>
                  </Label>

                  <Select value={selectedGender} onValueChange={handleGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Label className="my-2 block text-2xl">Program Information</Label>

              <div className="w-full">
                <Label className="mb-2 text-start">Program</Label>
                <Input
                  name="student_program"
                  className="mb-2"
                  onChange={handleChange}
                  defaultValue={student.student_program}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <Label className="mb-2 text-start">Grade Level</Label>
                  <Input
                    name="student_grade_level"
                    className="mb-2"
                    onChange={handleChange}
                    defaultValue={student.student_grade_level}
                  />
                </div>

                <div className="w-full">
                  <Label className="mb-2 text-start">Block / Section</Label>
                  <Input
                    name="student_block_section"
                    className="mb-2"
                    onChange={handleChange}
                    defaultValue={student.student_block_section}
                  />
                </div>
              </div>

              <Label className="my-2 block text-2xl">Contact Information</Label>

              <div className="w-full">
                <Label className="mb-2 text-start">Parent/Guardian Name</Label>
                <Input
                  name="student_parent_name"
                  className="mb-2"
                  onChange={handleChange}
                  defaultValue={student.student_parent_name}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <Label className="mb-2 text-start">
                    Parent/Guardian Phone Number(s)
                  </Label>
                  <Input
                    name="student_parent_number"
                    className="mb-2"
                    type="number"
                    onChange={handleChange}
                    defaultValue={student.student_parent_number}
                  />
                </div>

                <div className="w-full">
                  <Label className="mb-2 text-start">
                    Parent/Guardian Email Address (Optional)
                  </Label>
                  <Input
                    name="student_parent_email"
                    className="mb-2"
                    type="email"
                    onChange={handleChange}
                    defaultValue={student.student_parent_email}
                  />
                </div>
              </div>
            </div>
          </div>

          <span className="text-red-500">{error}</span>

          <div className="my-4 flex justify-end gap-4">
            <Button
              onClick={() => setShowEditForm(false)}
              className="w-[20%] self-center bg-[#585a57] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
            >
              Cancel
            </Button>
            <Button
              className="w-[20%] self-center bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
              type="submit"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
