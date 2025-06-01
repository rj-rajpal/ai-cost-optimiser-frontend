import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";

// Page imports
import ProjectsPage from "pages/projects";
import OnboardingWizard from "pages/onboarding-wizard";
import Dashboard from "pages/dashboard";
import DataUpload from "pages/data-upload";
import ProcessAnalysis from "pages/process-analysis";
import ROICalculator from "pages/roi-calculator";
import ScenarioLibrary from "pages/scenario-library";
import Login from "pages/login";
import Signup from "pages/signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/onboarding-wizard" element={<OnboardingWizard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data-upload" element={<DataUpload />} />
              <Route path="/process-analysis" element={<ProcessAnalysis />} />
              <Route path="/roi-calculator" element={<ROICalculator />} />
              <Route path="/scenario-library" element={<ScenarioLibrary />} />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;