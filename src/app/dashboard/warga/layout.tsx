import DashboardShell from "@/components/shell/DashboardShell";

export default function LayoutWarga({ children }: { children: React.ReactNode }) {
  return <DashboardShell peran="WARGA">{children}</DashboardShell>;
}
