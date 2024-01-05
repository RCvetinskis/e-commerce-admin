"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Color } from "@prisma/client";
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
  onCreateColor,
  onDeleteColor,
  onUpdateColor,
} from "@/actions/colors/color";

interface ColorFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
  value: z
    .string()
    .min(1, {
      message: "Required",
    })
    .regex(/^#/, {
      message: "String must be a valid hex code",
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm = ({ initialData }: ColorFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit color" : "Add a new color";

  const toastMessage = initialData ? "Color updated!" : "Color created!";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });
  const storeId = Array.isArray(params.storeId)
    ? params.storeId[0]
    : params.storeId;

  const colorId = Array.isArray(params.colorId)
    ? params.colorId[0]
    : params.colorId;

  const onSubmit = async (values: ColorFormValues) => {
    const success = () => {
      router.refresh();
      router.push(`/${storeId}/colors`);
      toast.success(toastMessage);
    };
    if (initialData) {
      startTransition(() => {
        onUpdateColor(storeId, colorId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    } else {
      startTransition(() => {
        onCreateColor(storeId, values)
          .then(() => success())
          .catch((error) => toast.error(error.message));
      });
    }
  };

  const onDelete = () => {
    startTransition(() => {
      onDeleteColor(storeId, colorId)
        .then(() => {
          router.refresh();
          router.push(`/${storeId}/colors`);
          toast.success("Color deleted");
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isPending}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
