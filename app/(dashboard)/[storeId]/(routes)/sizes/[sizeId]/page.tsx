import { SizeForm } from "./components/size-form";
import { getSizeById } from "@/lib/size-service";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await getSizeById(params.sizeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
