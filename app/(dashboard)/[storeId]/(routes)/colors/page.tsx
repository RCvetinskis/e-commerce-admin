import { format } from "date-fns";

import { ColorsClient } from "./components/client";

import { ColorsColumn } from "./components/columns";

import { getColors } from "@/lib/colors-service";
const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await getColors(params.storeId);

  const formatedColors: ColorsColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formatedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
