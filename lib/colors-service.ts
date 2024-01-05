import db from "./db";

export const getColors = async (storeId: string) => {
  const colors = await db.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return colors;
};

export const getColorById = async (id: string) => {
  const color = await db.color.findUnique({
    where: {
      id,
    },
  });

  return color;
};
