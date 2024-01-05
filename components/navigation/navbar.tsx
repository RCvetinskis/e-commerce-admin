import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "@/components/store-switcher";
import { redirect } from "next/navigation";
import { getAllStoresByUserId } from "@/lib/store-service";
import { ThemeToggle } from "../theme-toggle";

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await getAllStoresByUserId(userId);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
