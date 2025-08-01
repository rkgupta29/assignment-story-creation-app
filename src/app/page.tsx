import Sidebar from "@/components/Sidebar";
import { ShouldBeAuthenticated } from "@/lib/guards/ShouldBeAuthenticated";
import DashboardContent from "./dashboard";

export default function Home() {
  return (
    <ShouldBeAuthenticated>
      <Sidebar>
        <DashboardContent />
      </Sidebar>
    </ShouldBeAuthenticated>
  );
}
