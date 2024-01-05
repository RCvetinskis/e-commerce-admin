import { format } from "date-fns";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import { getCategories } from "@/lib/category-service";
const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await getCategories(params.storeId);

  const foramtedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={foramtedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
