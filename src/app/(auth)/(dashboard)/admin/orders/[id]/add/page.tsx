import AddOrderMenu from "./_components/add-order-menu";

export default async function AddOrderMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold uppercase">Add Order Item</h1>
        <AddOrderMenu id={id} />
      </div>
    </div>
  );
}
