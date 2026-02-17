import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import CreateQR from "./pages/CreateQR";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />
      <Route
        path="/features"
        element={
          <MainLayout>
            <Features />
          </MainLayout>
        }
      />
      <Route
        path="/how-it-works"
        element={
          <MainLayout>
            <HowItWorks />
          </MainLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          </ProtectedRoute>
        }
      />

      <Route
        path="/create/:id"
        element={
          <ProtectedRoute>
            {
              <MainLayout>
                <CreateQR />
              </MainLayout>
            }
          </ProtectedRoute>
        }
      />

      {/* Create QR */}
      <Route
        path="/create"
        element={
          <MainLayout>
            <CreateQR />
          </MainLayout>
        }
      />
    </Routes>
  );
}
