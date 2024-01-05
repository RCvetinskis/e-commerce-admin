import { getStoreById } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/navigation/navbar";

const DashBoardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await getStoreById(params.storeId);

  if (!store) {
    redirect("/");
  }
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
};

export default DashBoardLayout;
