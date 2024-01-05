import db from "./db";

export const getStoreById = async (storeId: string) => {
  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
  });

  return store;
};
export const getCurrentStoreViaUser = async (
  userId: string,
  storeId: string
) => {
  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  return store;
};

export const getStoreByUserId = async (userId: string) => {
  const store = await db.store.findFirst({
    where: {
      userId,
    },
  });

  return store;
};

export const getAllStoresByUserId = async (userId: string) => {
  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  return stores;
};
