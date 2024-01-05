import db from "./db";

export const getBillboardById = async (id: string) => {
  const billboard = await db.billboard.findUnique({
    where: {
      id,
    },
  });

  return billboard;
};
export const getBillboards = async (storeId: string) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return billboards;
};
