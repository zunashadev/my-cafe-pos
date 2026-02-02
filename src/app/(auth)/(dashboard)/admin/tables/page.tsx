import TablesManagement from "./_components/tables-management";

export default function MenusPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold uppercase">Tables Management</h1>
        <TablesManagement />
      </div>
    </div>
  );
}
