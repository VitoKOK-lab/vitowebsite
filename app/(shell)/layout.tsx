import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { visibleModules } from "@/lib/auth/visibility";
import { navItemFor } from "@/lib/nav";
import { DemoBar } from "@/lib/auth/DemoBar";
import { BottomNav } from "@/lib/ui/bottom-nav";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, industry } = getSession();
  const cfg = getIndustryConfig(industry);
  const mods = visibleModules(role, cfg);
  const navItems = mods.map((m) => navItemFor(m, cfg, role));

  return (
    <div className="min-h-screen">
      <DemoBar role={role} industry={industry} />
      <main className="mx-auto max-w-2xl px-3 pb-24 pt-4">{children}</main>
      <BottomNav items={navItems} />
    </div>
  );
}
