import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-full border bg-muted/50 p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 rounded-full px-0 ${
          theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/50"
        }`}
        onClick={() => setTheme("light")}
        title="Light Mode"
      >
        <Sun size={16} className={theme === "light" ? "text-foreground" : "text-muted-foreground"} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 rounded-full px-0 ${
          theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/50"
        }`}
        onClick={() => setTheme("dark")}
        title="Dark Mode"
      >
        <Moon size={16} className={theme === "dark" ? "text-foreground" : "text-muted-foreground"} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 rounded-full px-0 ${
          theme === "system" ? "bg-background shadow-sm" : "hover:bg-background/50"
        }`}
        onClick={() => setTheme("system")}
        title="System Default"
      >
        <Monitor size={16} className={theme === "system" ? "text-foreground" : "text-muted-foreground"} />
      </Button>
    </div>
  );
}
