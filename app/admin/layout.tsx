import { BrandLogo } from "@/components/brand-logo";
import { AdminNavigation } from "@/components/admin-navigation";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <div className="admin-nav">
        <div className="container nav">
          <BrandLogo width={130} className="admin-nav-logo" />
          <AdminNavigation />
        </div>
      </div>
      {children}
    </div>
  );
}
