import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ContentEditor } from "./content-editor";
export default async function ContentPage() {
  if (!(await requireAdmin())) redirect("/admin");
  return (
    <main className="admin-content">
      <div className="container">
        <div className="eyebrow">Website administration</div>
        <h1>Content Management</h1>
        <p>
          Manage games, promotions, events, gallery photographs and information
          pages.
        </p>
        <ContentEditor />
      </div>
    </main>
  );
}
