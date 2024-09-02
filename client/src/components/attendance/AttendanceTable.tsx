import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '../ui/button';
import axios from 'axios';
import {
  MaterialReactTable,
  MRT_TableInstance,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

interface Attendance {
  attendance_id: string;
  student_id_code: string;
  timeIn: string;
  timeOut: string;
  created_at: string;
}

const AttendanceTable = ({ attendance }: { attendance: Attendance[] }) => {
  const columns = useMemo<MRT_ColumnDef<Attendance>[]>(
    () => [
      {
        accessorKey: 'student_id_code',
        header: 'Student ID',
      },

      {
        accessorKey: 'timeIn',
        header: 'Time In',
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('LLLL'),
      },
      {
        accessorKey: 'timeOut',
        header: 'Time Out',
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('LLLL'),
      },
    ],
    [],
  );

  //   const handleDeleteRows = (
  //     rows: MRT_RowSelectionState,
  //     table: MRT_TableInstance<Attendance>,
  //   ) => {
  //     const selectedRowIds = Object.keys(rows);
  //     const isAllSelected = table.getIsAllRowsSelected();

  //     if (isAllSelected) {
  //       console.log(
  //         'Deleting all rows:',
  //         attendance?.map((row) => row.attendance_id),
  //       );

  //       const feedbackIds = attendance?.map((row) =>
  //         parseInt(row.attendance_id.toString(), 10),
  //       );

  //       feedbackIds?.forEach((id) => {
  //         axios
  //           .delete(`${import.meta.env.VITE_SERVER_LINK}/feedback.php`, {
  //             data: {
  //               feedback_id: id,
  //             },
  //           })
  //           .then((res) => {
  //             console.log(`Feedback ID ${id} deleted:`, res.data);
  //             mutate();
  //           })
  //           .catch((error) => {
  //             console.error(`Error deleting feedback ID ${id}:`, error);
  //           });
  //       });
  //     } else {
  //       console.log('Deleting selected rows:', selectedRowIds);

  //       // console.log(selectedRowIds[0]);

  //       const feedbackIds = selectedRowIds.map((row) =>
  //         parseInt(row.toString(), 10),
  //       );

  //       console.log(feedbackIds);

  //       feedbackIds.forEach((id) => {
  //         axios
  //           .delete(`${import.meta.env.VITE_SERVER_LINK}/feedback.php`, {
  //             data: {
  //               feedback_id: id,
  //             },
  //           })
  //           .then((res) => {
  //             console.log(`Feedback ID ${id} deleted:`, res.data);
  //             mutate();
  //           })
  //           .catch((error) => {
  //             console.error(`Error deleting feedback ID ${id}:`, error);
  //           });
  //       });
  //     }
  //   };

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const table = useMaterialReactTable({
    columns,
    data: attendance,
    enableRowSelection: true,
    getRowId: (row) => row.attendance_id.toString(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     className="bg-red-500"
    //     disabled={Object.keys(rowSelection).length === 0}
    //     onClick={() => handleDeleteRows(rowSelection, table)}
    //   >
    //     <DeleteIcon /> Delete Selected
    //   </Button>
    // ),
  });

  useEffect(() => {
    console.info({ rowSelection });
    console.info(table.getState().rowSelection);
  }, [rowSelection]);

  return <MaterialReactTable table={table} />;
};

export default AttendanceTable;
