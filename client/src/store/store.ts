import { create } from 'zustand';
import useSWR from 'swr';
import axios from 'axios';

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

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useFetchStudent = create((set) => {
  return {
    student: [] as Student[],
    image: null as string | null,
    fetchStudentData: (id: string) => {
      const url = id
        ? `${import.meta.env.VITE_SERVER_LINK}/student/${id}`
        : `${import.meta.env.VITE_SERVER_LINK}/student`;

      const { data, error } = useSWR(url, fetcher);

      if (error) {
        console.error('Error fetching student data:', error);
        return;
      }

      if (data) {
        if (id) {
          set({ student: data[0] });
          set({ image: data[0].student_image_path });
        } else {
          set({ student: data });
        }
      }
    },
  };
});

export { useFetchStudent };
