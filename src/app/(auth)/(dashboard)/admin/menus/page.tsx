import MenusManagement from "./_components/menus-management";

export default function MenusPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold uppercase">Menus Management</h1>
        <MenusManagement />
      </div>
    </div>
  );
}
