import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "@/features/auth/pages/SignUp";

function Login() {
  return <div>Login Page</div>;
}

function Dashboard() {
  return <div>Dashboard</div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}