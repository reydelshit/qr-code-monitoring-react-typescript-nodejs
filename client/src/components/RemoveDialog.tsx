import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';

import axios from 'axios';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

interface MemberItem {
  member_id?: number;
  name: string;
  username: string;
  password?: string;
  accessDuration: string; // E.g., "30 days", "1 year"
  permissions: string[]; // Array of permissions
  created_at?: Date;
}

const RemoveDialog = ({
  members,
  fetchMembers,
}: {
  members: MemberItem;
  fetchMembers: () => void;
}) => {
  const handleRemove = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_LINK}/members/delete/${
          members.member_id
        }`,
      );

      if (res.status === 200) {
        toast({
          title: 'Success',
          description: 'members has been removed',
        });

        fetchMembers();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-500 hover:bg-red-400">
          <Trash size={15} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            record. Please proceed with caution.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveDialog;
