import UsersManagement from "./_components/users-management";

export default function UsersPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold uppercase">Users Management</h1>
        <UsersManagement />
      </div>
    </div>
  );
}
