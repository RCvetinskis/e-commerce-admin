import db from "./db";

export const getProductById = async (id: string) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
    },
  });

  return product;
};
export const getProducts = async (storeId: string) => {
  const products = await db.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
};

export const getStockCount = async (storeId: string) => {
  const stockCount = await db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return stockCount;
};
