import { format } from "date-fns";

import { ProductClient } from "./components/client";

import { ProductColumn } from "./components/columns";
import { getProducts } from "@/lib/product-service";
import { formatter } from "@/lib/utils";
const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await getProducts(params.storeId);

  const foramtedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatutred: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(Number(item.price)),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={foramtedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
