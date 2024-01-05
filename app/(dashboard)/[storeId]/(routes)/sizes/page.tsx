import { format } from "date-fns";

import { SizeClient } from "./components/client";

import { SizeColumn } from "./components/columns";
import { getSizes } from "@/lib/size-service";
const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await getSizes(params.storeId);

  const formatedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formatedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
