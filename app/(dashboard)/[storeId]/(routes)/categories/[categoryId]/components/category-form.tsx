"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Billboard, Category } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
} from "@/actions/categories/category";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
  billboardId: z.string().min(1, {
    message: "Required",
  }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm = ({
  initialData,
  billboards,
}: CategoryFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit category" : "Add a new category";

  const toastMessage = initialData ? "Category updated!" : "Category created!";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });
  const storeId = Array.isArray(params.storeId)
    ? params.storeId[0]
    : params.storeId;

  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId;

  const onSubmit = async (values: CategoryFormValues) => {
    const success = () => {
      router.refresh();
      router.push(`/${storeId}/categories`);
      toast.success(toastMessage);
    };
    if (initialData) {
      startTransition(() => {
        onUpdateCategory(storeId, categoryId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    } else {
      startTransition(() => {
        onCreateCategory(storeId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    }
  };

  const onDelete = () => {
    startTransition(() => {
      onDeleteCategory(storeId, categoryId)
        .then(() => {
          router.refresh();
          router.push(`/${storeId}/categories`);
          toast.success("category deleted");
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setOpen(false));
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isPending={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>

                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
