"use server";

import db from "@/lib/db";
import { getCurrentStoreViaUser } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

interface Ibody {
  name: string;
  billboardId: string;
}
export const onCreateCategory = async (storeId: string, body: Ibody) => {
  try {
    const { userId } = auth();
    const { name, billboardId } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId) {
      throw new Error("Store id is required");
    }
    if (!name && !billboardId) {
      throw new Error("No values provided");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);

    if (!store) {
      throw new Error("Unauthorized");
    }

    const category = await db.category.create({
      data: {
        storeId,
        name,
        billboardId,
      },
    });
    revalidatePath(`/${storeId}/categories`);
    return category;
  } catch (error) {
    console.log(error, "ERROR ACTION ONCREATECATEGORY");
    throw error;
  }
};

export const onUpdateCategory = async (
  storeId: string,
  categoryId: string,
  body: Ibody
) => {
  try {
    const { userId } = auth();
    const { name, billboardId } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId && !categoryId) {
      throw new Error("Store and category id is required");
    }
    if (!name && !billboardId) {
      throw new Error("No values provided");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const category = await db.category.updateMany({
      where: {
        id: categoryId,
        storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    revalidatePath(`/${storeId}/categories`);
    revalidatePath(`/${storeId}/categories/${categoryId}`);
    return category;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONUPDATECATEGORY");
    throw error;
  }
};

export const onDeleteCategory = async (storeId: string, categoryId: string) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthenticated");

    if (!categoryId) throw new Error("Category id is required!");

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const category = await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    revalidatePath(`/${storeId}/categories`);
    revalidatePath(`/${storeId}/categories/${categoryId}`);

    return category;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONDELETECATEGORY");
    throw error;
  }
};
