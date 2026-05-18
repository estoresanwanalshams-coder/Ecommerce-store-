import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminCategoryPanel } from "@/components/AdminCategoryPanel";
import { AdminOrdersPanel } from "@/components/AdminOrdersPanel";
import { AdminProductPanel } from "@/components/AdminProductPanel";
import { AdminSiteSettingsPanel } from "@/components/AdminSiteSettingsPanel";

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminSiteSettingsPanel />
      <AdminOrdersPanel />
      <AdminCategoryPanel />
      <AdminProductPanel />
    </AdminAuthGate>
  );
}
