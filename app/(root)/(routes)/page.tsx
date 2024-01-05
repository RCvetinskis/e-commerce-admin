"use client";

import { useEffect } from "react";

import { userStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const { isOpen, onOpen } = userStoreModal((state) => state);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
