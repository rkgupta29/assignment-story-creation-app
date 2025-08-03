import { ShouldBeAuthenticated } from "@/lib/guards/ShouldBeAuthenticated";
import { CreateStoryForm } from "@/components/stories/CreateStoryForm";

export default function CreateStoryPage() {
  return (
    <ShouldBeAuthenticated>
      <div className="min-h-screen bg-gray-50">
        <CreateStoryForm />
      </div>
    </ShouldBeAuthenticated>
  );
}
