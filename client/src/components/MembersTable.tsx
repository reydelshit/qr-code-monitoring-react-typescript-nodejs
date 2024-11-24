'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddMemberDialog } from './MembersDialog';
import axios from 'axios';
import RemoveDialog from './RemoveDialog';

interface MemberItem {
  member_id?: number;
  name: string;
  username: string;
  password?: string;
  accessDuration: string; // E.g., "30 days", "1 year"
  permissions: string[]; // Array of permissions
  created_at?: Date;
}

export function MembersTable() {
  const [open, setOpen] = React.useState(false);
  const [members, setMembers] = React.useState<MemberItem[]>([]);

  const addMember = (member: MemberItem) => {
    setMembers([...members, member]);
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/members`,

        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setMembers(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Failed to fetch members', error);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Access Duration</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.username}</TableCell>
                <TableCell>{member.accessDuration}</TableCell>
                <TableCell>
                  {typeof member.permissions === 'string'
                    ? JSON.parse(member.permissions).join(', ')
                    : member.permissions.join(', ')}
                </TableCell>

                <TableCell>
                  <RemoveDialog members={member} fetchMembers={fetchMembers} />
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No members added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AddMemberDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={addMember}
        fetchMembers={fetchMembers}
      />
    </div>
  );
}
