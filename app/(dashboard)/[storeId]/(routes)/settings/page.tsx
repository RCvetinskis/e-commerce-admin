import { getCurrentStoreViaUser } from "@/lib/store-service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SettingsForm } from "./components/settings-form";
interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const store = await getCurrentStoreViaUser(userId, params.storeId);

  if (!store) {
    redirect("/");
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />{" "}
      </div>
    </div>
  );
};

export default SettingsPage;
