import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import { DashboardProvider } from "./contexts/DashboardContext";

// Layout imports (available for future use)
// import { ProjectLayout, MainLayout, AuthLayout } from "./layouts";

// Page imports
import LandingPage from "pages/LandingPage";
import ProjectsPage from "pages/projects";
import ProjectDetail from "pages/project-detail";
import OnboardingWizard from "pages/onboarding-wizard";
import Dashboard from "pages/dashboard";
import ROICalculator from "pages/roi-calculator";
import AIWorkflow from "pages/AIWorkflow";
import Login from "pages/login";
import Signup from "pages/signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-cloud-white">
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes with Dashboard Context */}
            <Route element={
              <DashboardProvider>
                <ProtectedRoute />
              </DashboardProvider>
            }>
              {/* Projects Overview */}
              <Route path="/projects" element={<ProjectsPage />} />
              
              {/* Onboarding Wizard */}
              <Route path="/onboarding-wizard" element={<OnboardingWizard />} />
              
              {/* Project Detail Routes */}
              <Route path="/project/:projectId" element={<ProjectDetail />}>
                <Route path="ai-workflow" element={<AIWorkflow />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="roi-calculator" element={<ROICalculator />} />
                {/* Default project route */}
                <Route index element={<Navigate to="ai-workflow" replace />} />
              </Route>
            </Route>
            
            {/* Catch all - redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;