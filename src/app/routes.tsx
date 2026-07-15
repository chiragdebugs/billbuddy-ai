import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "@/components/layout/Layout";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import Login from "@/features/auth/pages/Login";
import SignUp from "@/features/auth/pages/SignUp";

import Dashboard from "@/features/dashboard/pages/Dashboard";

import Bills from "@/features/bills/pages/Bills";
import CreateBill from "@/features/bills/pages/CreateBill";
import BillDetails from "@/features/bills/pages/BillDetails";
import EditBill from "@/features/bills/pages/EditBill";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/signup"
        element={<SignUp />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <Layout>
              <Bills />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-bill"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateBill />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bills/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <BillDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bills/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <EditBill />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}