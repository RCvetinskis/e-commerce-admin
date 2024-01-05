"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Store } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
import { onDeleteStore, onUpdateStore } from "@/actions/stores/store";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/api/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    startTransition(() => {
      onUpdateStore(initialData.id, values)
        .then(() => {
          router.refresh();
          toast.success("Store updated");
        })
        .catch((error) => toast.error(error.message));
    });
  };

  const onDelete = () => {
    startTransition(() => {
      onDeleteStore(initialData.id)
        .then(() => {
          router.refresh();
          router.push("/");
          toast.success("Store deleted");
        })
        .catch(() =>
          toast.error("Make sure you removed all products and categories first")
        )
        .finally(() => setOpen(false));
    });
  };

  const origin = useOrigin();
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isPending={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={isPending}
          variant={"destructive"}
          size={"sm"}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${initialData.id}`}
        variant="public"
      />
    </>
  );
};
