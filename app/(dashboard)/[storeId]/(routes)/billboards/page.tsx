import { format } from "date-fns";

import { BillboardClient } from "./components/client";
import { getBillboards } from "@/lib/billboard-service";
import { BillboardColumn } from "./components/columns";
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await getBillboards(params.storeId);

  const foramtedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={foramtedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
