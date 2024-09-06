import React from 'react';

import defaultProfile from '@/assets/profile.webp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { DialogClose } from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useState } from 'react';
// import { URL } from 'url';
import { SubmitHandler, useForm } from 'react-hook-form';

interface StudentFormData {
  student_id: string;
  student_id_code: string;
  student_image_path: File | null;
  student_firstname: string;
  student_lastname: string;
  student_middlename: string;
  student_datebirth: string;
  student_grade_level: string;
  student_program: string;
  student_block_section: string;
  student_parent_name: string;
  student_parent_number: string;
  student_parent_email: string;
  student_address: string;
}

export default function AddStudent({
  setShowStudentForm,
  mutate,
}: {
  setShowStudentForm: (value: boolean) => void;
  mutate: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormData>();

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('' as string);
  const [selectedGender, setSelectedGender] = useState('' as string);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorImage, setErrorImage] = useState<string | null>(null);

  const handleGender = (value: string) => {
    console.log(value);
    setSelectedGender(value);
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setImageFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
        setErrorImage(null);
      } else {
        setErrorImage('Please select a valid image file.');
        setImageFile(null);
      }
    }
  };

  const onSubmit: SubmitHandler<StudentFormData> = async (
    data: StudentFormData,
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    if (!imageFile) {
      setError('Please fill in all fields');
      return;
    }

    formData.append(
      'student_name',
      `${data.student_firstname} ${data.student_lastname}`,
    );

    formData.append('student_gender', selectedGender);
    formData.append('student_image_path', imageFile);

    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== 'student_firstname' &&
        key !== 'student_lastname' &&
        key !== 'student_gender' &&
        key !== 'student_image_path'
      ) {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/student/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.status === 'success') {
        toast({
          title: 'Student Added Successfully',
          description: 'The student has been added to the system.',
        });
        setShowStudentForm(false);
        mutate();
        reset();
        setImage(null);
        setSelectedGender('');
      }
    } catch (error) {
      console.error(error);

      toast({
        title: 'Error',
        description: 'An error occurred while adding the student.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-[1rem] p-2">
      <form
        className="w-full px-4 text-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-4">
          <div className="flex w-[25rem] flex-col">
            <img
              className="mb-4 h-[20rem] w-full rounded-lg object-cover"
              src={image! ? image! : defaultProfile}
            />
            <Label className="mb-2 text-start">Student image</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="cursor-pointer"
              required
            />
          </div>

          <div className="w-full">
            <Label className="my-2 block text-2xl">Basic Information</Label>
            <div className="w-full">
              <Label className="mb-2 text-start">Student ID</Label>
              <Input
                className="mb-2"
                required
                {...register('student_id_code', {
                  required: 'Student ID is required',
                })}
              />
              {errors.student_id && <span>{errors.student_id.message}</span>}
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Label className="mb-2 text-start">First Name</Label>
                <Input
                  className="mb-2"
                  required
                  {...register('student_firstname', {
                    required: 'Firstname is required',
                  })}
                />
              </div>

              <div className="w-full">
                <Label className="mb-2 text-start">Last Name</Label>
                <Input
                  className="mb-2"
                  required
                  {...register('student_lastname', {
                    required: 'Lastname is required',
                  })}
                />
              </div>

              <div className="w-full">
                <Label className="mb-2 text-start">Middle Name</Label>
                <Input
                  className="mb-2"
                  required
                  {...register('student_middlename', {
                    required: 'Firstname is required',
                  })}
                />
              </div>
            </div>
            <div className="item-start flex flex-col">
              <Label className="mb-2 text-start">Date of Birth</Label>
              <Input
                type="date"
                className="mb-2"
                required
                {...register('student_datebirth', {
                  required: 'student_datebirth is required',
                })}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Label className="mb-2 text-start">Address</Label>
                <Input
                  className="mb-2"
                  required
                  {...register('student_address', {
                    required: 'student_address is required',
                  })}
                />
              </div>

              <div className="mb-[2rem] w-full text-start">
                <Label className="mb-2">Gender</Label>

                <Select
                  required
                  value={selectedGender}
                  onValueChange={handleGender}
                >
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
                className="mb-2"
                required
                {...register('student_program', {
                  required: 'student_program is required',
                })}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <Label className="mb-2 text-start">Grade Level</Label>
                <Input
                  className="mb-2"
                  required
                  {...register('student_grade_level', {
                    required: 'student_grade_level is required',
                  })}
                />
              </div>

              <div className="w-full">
                <Label className="mb-2 text-start">Block / Section</Label>
                <Input
                  className="mb-2"
                  required
                  {...register('student_block_section', {
                    required: 'student_block_section is required',
                  })}
                />
              </div>
            </div>

            <Label className="my-2 block text-2xl">Contact Information</Label>

            <div className="w-full">
              <Label className="mb-2 text-start">Parent/Guardian Name</Label>
              <Input
                className="mb-2"
                required
                {...register('student_parent_name', {
                  required: 'student_parent_name is required',
                })}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <Label className="mb-2 text-start">
                  Parent/Guardian Phone Number(s)
                </Label>
                <Input
                  className="mb-2"
                  required
                  type="number"
                  {...register('student_parent_number', {
                    required: 'student_parent_number is required',
                  })}
                />
              </div>

              <div className="w-full">
                <Label className="mb-2 text-start">
                  Parent/Guardian Email Address (Optional)
                </Label>
                <Input
                  className="mb-2"
                  type="email"
                  required
                  {...register('student_parent_email', {
                    required: 'student_parent_email is required',
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        <span className="text-red-500">{error}</span>

        <div className="my-4 flex justify-end gap-4">
          {/* <Button
            onClick={() => setShowStudentForm(false)}
            className="w-[20%] self-center bg-[#585a57] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
          >
            Cancel
          </Button> */}

          <DialogClose>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            className="w-[20%] self-center bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
            type="submit"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
