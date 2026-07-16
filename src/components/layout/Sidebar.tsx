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
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
              <WalletCards size={18} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              BillBuddy AI
            </h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <div className="flex items-center gap-3">
                <Search size={20} />
                <span>Search</span>
              </div>
              <div className="hidden items-center gap-1 rounded border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium sm:flex">
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
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="flex flex-col gap-4">
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