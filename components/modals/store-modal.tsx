"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import { useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { userStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { onCreateStore } from "@/actions/stores/store";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "No value provided",
  }),
});

export const StoreModal = () => {
  const { isOpen, onClose } = userStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      const { name } = values;
      onCreateStore(name)
        .then((res) => window.location.assign(`/${res.id}`))
        .catch((error) => toast.error(error.message));
    });
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-Commerce"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  variant={"outline"}
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  Continiue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
