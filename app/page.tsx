import PMSApp from "@/app/pms/PMSApp";
import { requireAppViewer } from "@/lib/auth/session";

export default async function Page() {
  await requireAppViewer("/");

  return <PMSApp />;
}
