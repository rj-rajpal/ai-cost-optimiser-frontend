import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Routes from "./Routes";

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-white"
          fill="currentColor"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">AI Cost Optimizer</h2>
      <p className="text-text-secondary">Loading...</p>
      <div className="mt-4 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
);

// App Content Component (to use auth hook)
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <Routes />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
