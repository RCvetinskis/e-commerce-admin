"use server";

import db from "@/lib/db";
import { getCurrentStoreViaUser } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

interface Ibody {
  name: string;
  value: string;
}
export const onCreateSize = async (storeId: string, body: Ibody) => {
  try {
    const { userId } = auth();
    const { name, value } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId) {
      throw new Error("Store id is required");
    }
    if (!name && !value) {
      throw new Error("No values provided");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);

    if (!store) {
      throw new Error("Unauthorized");
    }

    const size = await db.size.create({
      data: {
        storeId,
        name,
        value,
      },
    });
    revalidatePath(`/${storeId}/sizes`);
    return size;
  } catch (error) {
    console.log(error, "ERROR ACTION ONCREATESIZE");
    throw error;
  }
};

export const onUpdateSize = async (
  storeId: string,
  sizeId: string,
  body: Ibody
) => {
  try {
    const { userId } = auth();
    const { name, value } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId && !sizeId) {
      throw new Error("Store and size id is required");
    }
    if (!name && !value) {
      throw new Error("No values provided");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const size = await db.size.updateMany({
      where: {
        id: sizeId,
        storeId,
      },
      data: {
        name,
        value,
      },
    });

    revalidatePath(`/${storeId}/sizes`);
    revalidatePath(`/${storeId}/sizes/${sizeId}`);
    return size;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONUPDATESIZE");
    throw error;
  }
};

export const onDeleteSize = async (storeId: string, sizeId: string) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthenticated");

    if (!sizeId) throw new Error("Size id is required!");

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const size = await db.size.delete({
      where: {
        id: sizeId,
      },
    });

    revalidatePath(`/${storeId}/sizes`);
    revalidatePath(`/${storeId}/sizes/${sizeId}`);

    return size;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONDELETESIZES");
    throw error;
  }
};
