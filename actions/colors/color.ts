"use server";

import db from "@/lib/db";
import { getCurrentStoreViaUser } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

interface Ibody {
  name: string;
  value: string;
}
export const onCreateColor = async (storeId: string, body: Ibody) => {
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

    const color = await db.color.create({
      data: {
        storeId,
        name,
        value,
      },
    });
    revalidatePath(`/${storeId}/colors`);
    return color;
  } catch (error) {
    console.log(error, "ERROR ACTION ONCREATECOLOR");
    throw error;
  }
};

export const onUpdateColor = async (
  storeId: string,
  colorId: string,
  body: Ibody
) => {
  try {
    const { userId } = auth();
    const { name, value } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId && !colorId) {
      throw new Error("Store and color id is required");
    }
    if (!name && !value) {
      throw new Error("No values provided");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const color = await db.color.updateMany({
      where: {
        id: colorId,
        storeId,
      },
      data: {
        name,
        value,
      },
    });

    revalidatePath(`/${storeId}/colors`);
    revalidatePath(`/${storeId}/colors/${colorId}`);
    return color;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONUPDATECOLOR");
    throw error;
  }
};

export const onDeleteColor = async (storeId: string, colorId: string) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthenticated");

    if (!colorId) throw new Error("Color id is required!");

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const color = await db.color.delete({
      where: {
        id: colorId,
      },
    });

    revalidatePath(`/${storeId}/colors`);
    revalidatePath(`/${storeId}/colors/${colorId}`);

    return color;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONDELETECOLORS");
    throw error;
  }
};
