import DashboardShell from "@/components/shell/DashboardShell";

export default function LayoutPengurus({ children }: { children: React.ReactNode }) {
  return <DashboardShell peran="PENGURUS">{children}</DashboardShell>;
}
