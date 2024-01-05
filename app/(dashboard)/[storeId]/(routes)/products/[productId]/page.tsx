import { getProductById } from "@/lib/product-service";
import { ProductForm } from "./components/product-form";
import { getCategories } from "@/lib/category-service";
import { getSizes } from "@/lib/size-service";
import { getColors } from "@/lib/colors-service";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await getProductById(params.productId);

  const categories = await getCategories(params.storeId);
  const sizes = await getSizes(params.storeId);
  const colors = await getColors(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
