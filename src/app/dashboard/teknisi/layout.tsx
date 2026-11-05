import DashboardShell from "@/components/shell/DashboardShell";

export default function LayoutTeknisi({ children }: { children: React.ReactNode }) {
  return <DashboardShell peran="TEKNISI">{children}</DashboardShell>;
}
