"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Size } from "@prisma/client";
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
import { onCreateSize, onDeleteSize, onUpdateSize } from "@/actions/sizes/size";

interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
  value: z.string().min(1, {
    message: "No image selected",
  }),
});

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit size" : "Add a new size";

  const toastMessage = initialData ? "Size updated!" : "Size created!";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });
  const storeId = Array.isArray(params.storeId)
    ? params.storeId[0]
    : params.storeId;

  const sizeId = Array.isArray(params.sizeId)
    ? params.sizeId[0]
    : params.sizeId;

  const onSubmit = async (values: SizeFormValues) => {
    const success = () => {
      router.refresh();
      router.push(`/${storeId}/sizes`);
      toast.success(toastMessage);
    };
    if (initialData) {
      startTransition(() => {
        onUpdateSize(storeId, sizeId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    } else {
      startTransition(() => {
        onCreateSize(storeId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    }
  };

  const onDelete = () => {
    startTransition(() => {
      onDeleteSize(storeId, sizeId)
        .then(() => {
          router.refresh();
          router.push(`/${storeId}/sizes`);
          toast.success("Size deleted");
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
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Size value"
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
