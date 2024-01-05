"use server";

import { ProductFormValues } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/components/product-form";
import db from "@/lib/db";
import { getCurrentStoreViaUser } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const onCreateProduct = async (
  storeId: string,
  body: ProductFormValues
) => {
  try {
    const { userId } = auth();
    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      isArchived,
      isFeatured,
      images,
    } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId) {
      throw new Error("Store id is required");
    }
    if (!name && !price && !categoryId && !sizeId && !colorId) {
      throw new Error("No values provided");
    }
    if (!images || !images.length) {
      throw new Error("Images required");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);

    if (!store) {
      throw new Error("Unauthorized");
    }

    const product = await db.product.create({
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        storeId,
        sizeId,
        colorId,
        categoryId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    revalidatePath(`/${storeId}/products`);
    return product;
  } catch (error) {
    console.log(error, "ERROR ACTION ONCREATEBILLBOARD");
    throw error;
  }
};

export const onUpdateProduct = async (
  storeId: string,
  productId: string,
  body: ProductFormValues
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      isArchived,
      isFeatured,
      images,
    } = body;

    if (!userId) {
      throw new Error("Unauthenticated");
    }
    if (!storeId) {
      throw new Error("Store id is required");
    }
    if (!name && !price && !categoryId && !sizeId && !colorId) {
      throw new Error("No values provided");
    }
    if (!images || !images.length) {
      throw new Error("Images required");
    }

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    await db.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await db.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return product;
    revalidatePath(`/${storeId}/products`);
    revalidatePath(`/${storeId}/products/${productId}`);
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONUPDATEPRODUCT");
    throw error;
  }
};
export const onDeleteProduct = async (storeId: string, productId: string) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthenticated");

    if (!productId) throw new Error("Product id is required!");

    const store = await getCurrentStoreViaUser(userId, storeId);
    if (!store) throw new Error("Unauthorized");

    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath(`/${storeId}/products`);
    revalidatePath(`/${storeId}/products/${productId}`);

    return product;
  } catch (error) {
    console.log(error, "ERROR IN ACTION ONDELETEPRODUCT");
    throw error;
  }
};
