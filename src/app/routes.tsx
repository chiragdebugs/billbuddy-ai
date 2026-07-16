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

import Groups from "@/features/groups/pages/Groups";
import CreateGroup from "@/features/groups/pages/CreateGroup";
import GroupDetails from "@/features/groups/pages/GroupDetails";
import UploadReceipt from "@/features/receipts/pages/UploadReceipt";
import Leaderboard from "@/features/gamification/pages/Leaderboard";
import Subscriptions from "@/features/subscriptions/pages/Subscriptions";
import Analytics from "@/features/analytics/pages/Analytics";
import Settings from "@/features/settings/pages/Settings";

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
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Layout>
              <Groups />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <Layout>
              <Subscriptions />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateGroup />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <GroupDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-receipt"
        element={
          <ProtectedRoute>
            <Layout>
              <UploadReceipt />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Leaderboard />
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