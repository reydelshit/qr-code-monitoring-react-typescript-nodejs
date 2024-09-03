import { IBoundingBox, IPoint } from '@yudiel/react-qr-scanner';

export interface IDetectedBarcode {
  boundingBox: IBoundingBox;
  cornerPoints: IPoint[];
  format: string;
  rawValue: string;
}

export interface Attendance {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}

export interface Student {
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
