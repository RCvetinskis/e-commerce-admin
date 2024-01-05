"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
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
import { ImageUpload } from "@/components/ui/image-upload";
import {
  onCreateBillboard,
  onDeleteBillboard,
  onUpdateBillboard,
} from "@/actions/billboards/billboard";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1, {
    message: "Required",
  }),
  imageUrl: z.string().min(1, {
    message: "No image selected",
  }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit billboard" : "Add a new billboard";

  const toastMessage = initialData
    ? "Billboard updated!"
    : "Billboard created!";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });
  const storeId = Array.isArray(params.storeId)
    ? params.storeId[0]
    : params.storeId;

  const billboardId = Array.isArray(params.billboardId)
    ? params.billboardId[0]
    : params.billboardId;

  const onSubmit = async (values: BillboardFormValues) => {
    const success = () => {
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast.success(toastMessage);
    };
    if (initialData) {
      startTransition(() => {
        onUpdateBillboard(storeId, billboardId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    } else {
      startTransition(() => {
        onCreateBillboard(storeId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    }
  };

  const onDelete = () => {
    startTransition(() => {
      onDeleteBillboard(storeId, billboardId)
        .then(() => {
          router.refresh();
          router.push(`/${storeId}/billboards`);
          toast.success("Billboard deleted");
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>

                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isPending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
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
