import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-emerald-600">
          BillBuddy AI
        </h1>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm font-medium hover:text-emerald-600">
            Features
          </a>

          <a href="#" className="text-sm font-medium hover:text-emerald-600">
            Pricing
          </a>

          <a href="#" className="text-sm font-medium hover:text-emerald-600">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost">Login</Button>

          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;