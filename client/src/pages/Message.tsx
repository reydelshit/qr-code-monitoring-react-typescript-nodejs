import { ExportPDF } from '@/components/ExportPDF';
import PaginationTemplate from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/usePagination';
import { MessageType } from '@/types/message';
import React from 'react';
import useSWR from 'swr';

const Message = () => {
  const [search, setSearch] = React.useState('');

  const fetcher = async (url: string): Promise<MessageType[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const {
    data: messages = [],
    error,
    isLoading,
    mutate,
  } = useSWR(`${import.meta.env.VITE_SERVER_LINK}/messages`, fetcher);

  console.log(messages, 'message');

  const filteredStudents = messages.filter((mess) => {
    return (
      mess.student_id.toLowerCase().includes(search.toLowerCase()) ||
      mess.student_id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 10,
      data: filteredStudents,
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="my-4 text-6xl font-bold">Message</h1>

      <div className="mt-[2rem] w-full pr-4">
        <div className="flex flex-col items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <Input
              className="w-[20rem]"
              placeholder="Search for student ID"
              onChange={(e) => setSearch(e.target.value)}
            />

            <ExportPDF
              data={currentItems}
              fileName={`Messages_`}
              title={`Messages_`}
            />
          </div>

          <div className="mt-4 flex w-full justify-between">
            <span className="block font-semibold">
              Showing {currentItems.length} of {messages.length} entries
            </span>

            <span className="mt-4 block font-semibold">Shows 10 per page</span>
          </div>
        </div>
        <Table className="my-4 w-full">
          <TableCaption>
            A list of sent messages to student parents.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Recepient Number</TableHead>
              <TableHead> Sender </TableHead>
              <TableHead>Message Content</TableHead>
              <TableHead>Date Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((message, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{message.student_id}</TableCell>
                  <TableCell>
                    {message.recepientNumber.length > 0
                      ? message.recepientNumber
                      : 'N/A'}
                  </TableCell>
                  <TableCell>Notre Dame Sienna</TableCell>
                  <TableCell>{message.content}</TableCell>
                  <TableCell>{message.dateSent}</TableCell>
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
    </div>
  );
};

export default Message;
