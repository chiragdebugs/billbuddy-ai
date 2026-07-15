import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-6 md:px-10">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Manage your expenses easily
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            {user?.user_metadata?.full_name || "User"}
          </p>

          <p className="text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
          <User size={20} />
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl p-3 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}