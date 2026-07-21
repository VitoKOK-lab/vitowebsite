import { getSession } from "@/lib/auth/session";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { visibleModules } from "@/lib/auth/visibility";
import { navItemFor } from "@/lib/nav";
import { DemoBar } from "@/lib/auth/DemoBar";
import { BottomNav } from "@/lib/ui/bottom-nav";
import { Sidebar } from "@/lib/ui/sidebar";

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
      <div className="mx-auto flex w-full max-w-6xl">
        <Sidebar items={navItems} />
        <main className="min-w-0 flex-1 px-3 pb-24 pt-4 lg:px-6 lg:pb-10">
          {children}
        </main>
      </div>
      <div className="lg:hidden">
        <BottomNav items={navItems} />
      </div>
    </div>
  );
}
