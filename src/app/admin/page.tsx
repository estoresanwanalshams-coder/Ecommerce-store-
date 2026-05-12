import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminCategoryPanel } from "@/components/AdminCategoryPanel";
import { AdminProductPanel } from "@/components/AdminProductPanel";
import { AdminSiteSettingsPanel } from "@/components/AdminSiteSettingsPanel";

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminSiteSettingsPanel />
      <AdminCategoryPanel />
      <AdminProductPanel />
    </AdminAuthGate>
  );
}
