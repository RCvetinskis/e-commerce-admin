"use server";

import db from "@/lib/db";
import { getCurrentStoreViaUser } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

interface Ibody {
  label: string;
  imageUrl: string;
}
export const onCreateBillboard = async (storeId: string, body: Ibody) => {
  try {
    const { userId } = auth();
    const { label, imageUrl } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId) {
      throw new Error("Store id is required");
    }
    if (!label && !imageUrl) {
      throw new Error("No values provided");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);

    if (!store) {
      throw new Error("Unauthorized");
    }

    const billboard = await db.billboard.create({
      data: {
        storeId,
        label,
        imageUrl,
      },
    });
    revalidatePath(`/${storeId}/billboards`);
    return billboard;
  } catch (error) {
    console.log(error, "ERROR ACTION ONCREATEBILLBOARD");
    throw error;
  }
};

export const onUpdateBillboard = async (
  storeId: string,
  billboardId: string,
  body: Ibody
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const { label, imageUrl } = body;

    if (!label) throw new Error("Label is required!");
    if (!imageUrl) throw new Error("Image is required!");
    if (!billboardId) throw new Error("Billboard id is required!");

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const billboard = await db.billboard.updateMany({
      where: {
        id: billboardId,
        storeId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    revalidatePath(`/${storeId}/billboards`);
    revalidatePath(`/${storeId}/billboards/${billboardId}`);
    return billboard;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONUPDATEBILLBOARD");
    throw error;
  }
};
export const onDeleteBillboard = async (
  storeId: string,
  billboardId: string
) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthenticated");

    if (!billboardId) throw new Error("Billboard id is required!");

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const billboard = await db.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    revalidatePath(`/${storeId}/billboards`);
    revalidatePath(`/${storeId}/billboards/${billboardId}`);

    return billboard;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONDELETEBILLBOARD");
    throw error;
  }
};
