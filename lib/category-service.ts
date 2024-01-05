import db from "./db";

export const getCategories = async (storeId: string) => {
  const categories = await db.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return categories;
};

export const getCategoryById = async (id: string) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
  });

  return category;
};
