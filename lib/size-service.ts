import db from "./db";

export const getSizes = async (storeId: string) => {
  const sizes = await db.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return sizes;
};

export const getSizeById = async (id: string) => {
  const size = await db.size.findUnique({
    where: {
      id,
    },
  });

  return size;
};
