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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <RouterRoutes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirect root to login for unauthenticated users, projects for authenticated */}
            <Route path="/" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/onboarding-wizard" element={
              <ProtectedRoute>
                <OnboardingWizard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/data-upload" element={
              <ProtectedRoute>
                <DataUpload />
              </ProtectedRoute>
            } />
            
            <Route path="/process-analysis" element={
              <ProtectedRoute>
                <ProcessAnalysis />
              </ProtectedRoute>
            } />
            
            <Route path="/roi-calculator" element={
              <ProtectedRoute>
                <ROICalculator />
              </ProtectedRoute>
            } />
            
            <Route path="/scenario-library" element={
              <ProtectedRoute>
                <ScenarioLibrary />
              </ProtectedRoute>
            } />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;