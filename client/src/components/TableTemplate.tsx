import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

type TableTemplate<T extends Record<string, React.ReactNode>> = {
  data: T[];
  header: string[];
  caption?: string;
};

const TableTemplate = <T extends Record<string, React.ReactNode>>({
  data,
  header,
  caption,
}: TableTemplate<T>) => {
  return (
    <>
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {header.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((data, index) => (
            <TableRow key={index}>
              {Object.values(data).map((value, cellIndex) => (
                <TableCell key={cellIndex}>
                  {value as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      ;
    </>
  );
};

export default TableTemplate;
