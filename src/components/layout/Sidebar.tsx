import {
  BarChart3,
  FileText,
  Home,
  Settings,
  Users,
  WalletCards,
  Search,
  Trophy,
  Calendar,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "../ui/theme-toggle";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Bills",
    path: "/bills",
    icon: FileText,
  },
  {
    name: "Groups",
    path: "/groups",
    icon: Users,
  },
  {
    name: "Subscriptions",
    path: "/subscriptions",
    icon: Calendar,
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: Trophy,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpenSearch }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-border/40 bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center gap-3 pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-soft">
              <WalletCards size={18} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              BillBuddy
            </h1>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
            >
              <div className="flex items-center gap-3">
                <Search size={18} />
                <span>Search</span>
              </div>
              <div className="hidden items-center gap-1 rounded-md border border-border/50 bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:flex">
                <span>⌘</span>K
              </div>
            </button>

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-accent text-accent-foreground shadow-soft"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}