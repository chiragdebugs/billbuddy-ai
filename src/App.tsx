import AppRoutes from "./app/routes";
import { ModeProvider } from "./context/ModeProvider";

export default function App() {
  return (
    <ModeProvider>
      <AppRoutes />
    </ModeProvider>
  );
}