import { getStoreByUserId } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await getStoreByUserId(userId);

  if (store) {
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
};

export default SetupLayout;
