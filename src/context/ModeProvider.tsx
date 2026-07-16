import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AppMode = "Standard" | "Travel" | "Family";

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("Standard");

  // Load from local storage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("billbuddy_app_mode") as AppMode;
    if (savedMode && ["Standard", "Travel", "Family"].includes(savedMode)) {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem("billbuddy_app_mode", newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useAppMode must be used within a ModeProvider");
  }
  return context;
}
