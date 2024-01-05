"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const onCreateStore = async (name: string) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });

    return store;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONCREATESTORE");
    throw error;
  }
};

interface Ibody {
  name: string;
}
export const onUpdateStore = async (storeId: string, body: Ibody) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const { name } = body;

    if (!name) {
      throw new Error("Name is required!");
    }
    if (!storeId) {
      throw new Error("Store id is required!");
    }

    const store = await db.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });
    revalidatePath("/");
    revalidatePath(`/${storeId}`);
    revalidatePath(`/${storeId}/settings`);
    return store;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONUPDATESTORE");
    throw error;
  }
};
export const onDeleteStore = async (storeId: string) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    if (!storeId) {
      throw new Error("Store id is required!");
    }

    const store = await db.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });
    revalidatePath("/");
    revalidatePath(`/${storeId}`);
    revalidatePath(`/${storeId}/settings`);

    return store;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONDELETESTORE");
    throw error;
  }
};
