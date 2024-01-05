"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}
export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant={"outline"} disabled={isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={"destructive"}
          disabled={isPending}
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
