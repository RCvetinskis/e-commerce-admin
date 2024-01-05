import { getBillboards } from "@/lib/billboard-service";
import { CategoryForm } from "./components/category-form";
import { getCategoryById } from "@/lib/category-service";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await getCategoryById(params.categoryId);

  const billboards = await getBillboards(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
