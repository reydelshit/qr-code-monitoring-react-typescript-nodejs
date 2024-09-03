import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

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
        id: 'Log_Date',
        header: 'Log Date',
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('LL'),
      },
      {
        id: 'arrival_time',
        header: 'Arrival Time',
        Cell: ({ row }) => {
          const timeIn = row.original.timeIn;

          if (timeIn) {
            return moment(timeIn).format('LT');
          }
        },
      },

      {
        id: 'status',
        header: 'Status',
        Cell: ({ row }) => {
          const timeIn = row.original.timeIn;
          if (timeIn !== 'n/a' && timeIn !== null) {
            return 'Enter the campus';
          }
        },
      },
      {
        id: 'exit_time',
        header: 'Departure Time',
        Cell: ({ row }) => {
          const timeOut = row.original.timeOut;

          if (
            timeOut !== 'n/a' &&
            timeOut !== null &&
            timeOut !== 'Invalid date'
          ) {
            return moment(timeOut).format('LT');
          } else {
            return 'Not yet time out';
          }
        },
      },

      {
        id: 'status',
        header: 'Status',
        Cell: ({ row }) => {
          const timeOut = row.original.timeOut;
          if (timeOut !== 'n/a' && timeOut !== null) {
            return 'Exit the campus';
          } else {
            return 'N/A';
          }
        },
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
