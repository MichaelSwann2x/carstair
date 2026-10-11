import AppShell from "@/components/AppShell";
import WellnessReminder from "@/components/WellnessReminder";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
      <WellnessReminder />
    </AppShell>
  );
}
