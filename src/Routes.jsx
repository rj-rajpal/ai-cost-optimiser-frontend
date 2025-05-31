import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import OnboardingWizard from "pages/onboarding-wizard";
import Dashboard from "pages/dashboard";
import DataUpload from "pages/data-upload";
import ProcessAnalysis from "pages/process-analysis";
import ROICalculator from "pages/roi-calculator";
import ScenarioLibrary from "pages/scenario-library";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding-wizard" element={<OnboardingWizard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-upload" element={<DataUpload />} />
          <Route path="/process-analysis" element={<ProcessAnalysis />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/scenario-library" element={<ScenarioLibrary />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;