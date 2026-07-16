import { LogOut, Menu, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useAppMode, AppMode } from "@/context/ModeProvider";
import { Plane, Users as UsersIcon, LayoutTemplate } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { mode, setMode } = useAppMode();

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/login");
  };

  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === "/dashboard") {
      return { title: "Dashboard", subtitle: "Manage your expenses easily" };
    }
    if (path === "/bills") {
      return { title: "Bills", subtitle: "Track and split your bills" };
    }
    if (path === "/create-bill") {
      return { title: "Create Bill", subtitle: "Add a new split expense" };
    }
    if (path === "/groups") {
      return { title: "Groups", subtitle: "Manage your shared groups" };
    }
    if (path === "/analytics") {
      return { title: "Analytics", subtitle: "View your spending insights" };
    }
    if (path === "/settings") {
      return { title: "Settings", subtitle: "Configure your preferences" };
    }
    if (path.startsWith("/bills/")) {
      if (path.endsWith("/edit")) {
        return { title: "Edit Bill", subtitle: "Update bill details" };
      }
      return { title: "Bill Details", subtitle: "View splits and settle up" };
    }
    return { title: "BillBuddy AI", subtitle: "Settle up easily" };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="flex h-20 items-center justify-between border-b bg-background px-6 md:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>

          <p className="hidden text-sm text-muted-foreground sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mode Switcher */}
        <div className="hidden items-center rounded-lg border bg-muted/30 p-1 sm:flex">
          <button
            onClick={() => setMode("Standard")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "Standard" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutTemplate size={14} />
            Standard
          </button>
          <button
            onClick={() => setMode("Travel")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "Travel" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane size={14} />
            Travel
          </button>
          <button
            onClick={() => setMode("Family")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "Family" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UsersIcon size={14} />
            Family
          </button>
        </div>

        <NotificationBell />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">
            {user?.user_metadata?.full_name || "User"}
          </p>

          <p className="text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={20} />
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl p-3 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}