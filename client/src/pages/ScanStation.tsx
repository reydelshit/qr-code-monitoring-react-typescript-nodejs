import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileDefault from '@/assets/profile.webp';
import { IBoundingBox, IPoint, Scanner } from '@yudiel/react-qr-scanner';

import useSWR from 'swr';

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

  // const fetcher = async (url: string): Promise<{}[]> => {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   return response.json();
  // };

  // const { data, error, isLoading } = useSWR(
  //   studentID ? `${import.meta.env.VITE_SERVER_LINK}/scan/${studentID}` : null,
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     // revalidateOnReconnect: false,
  //   },
  // );

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error fetching data</div>;

  // const student =
  //   data && data.length > 0 ? (data[0] as Student) : ({} as Student);

  return (
    <div className="relative h-full">
      <h1 className="my-4 text-6xl font-bold">Scan Station</h1>

      <div className="flex h-full w-full flex-col items-center border-2">
        <h1 className="mt-[2rem]">SCAN QR CODE</h1>

        <div className="my-[2rem] flex gap-4">
          <Button>Time In</Button>
          <Button>Time Out</Button>
        </div>

        <div className="flex h-full w-[100%] items-start justify-center gap-4">
          {/* <img className="w-[20%]" src={ProfileDefault} alt="Student Image" /> */}

          <div className="h-[40%] w-[30%] bg-orange-500">
            <Scanner
              allowMultiple={true}
              onScan={(result: IDetectedBarcode[]) => {
                // console.log(result);
                // setStudentID(result[0].rawValue);

                console.log('Student ID:', result[0].rawValue);

                axios
                  .get(
                    `${import.meta.env.VITE_SERVER_LINK}/student/scan/${result[0].rawValue}`,
                  )
                  .then((res) => {
                    console.log(res.data, 'Student Data');
                    setStudent(res.data[0]);
                  });
              }}
            />
          </div>

          <div className="grid h-full w-[80%] grid-cols-2 border-2">
            {student && (
              <div className="flex w-full flex-col items-center border-2">
                <img
                  className="h-[15rem] w-[15rem] object-cover"
                  src={
                    student.student_image_path?.length > 0
                      ? `${import.meta.env.VITE_SERVER_LINK}/${student.student_image_path}`
                      : ProfileDefault
                  }
                  alt="Student Image"
                />

                <h1>Student Name: {student.student_name}</h1>
                <h1>Grade Level</h1>
                <h1>Block Section</h1>
              </div>
            )}

            <div className="w-full">table here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanStation;
