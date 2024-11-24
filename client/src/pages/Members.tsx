import { MembersTable } from '@/components/MembersTable';

const Members = () => {
  return (
    <div className="mr-8 py-10">
      <div className="my-4">
        <h1 className="text-6xl font-bold">Members</h1>
        {/* <p className="font-semibold">Welcome to the dashboard</p> */}
      </div>
      <MembersTable />
    </div>
  );
};

export default Members;
