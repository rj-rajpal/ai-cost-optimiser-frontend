import React from 'react';
import { Outlet } from 'react-router-dom';
import Icon from '../components/AppIcon';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cloud-white via-fog-gray to-mist-teal/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-muted-indigo rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-mist">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-soft-navy mb-2">AI Cost Optimizer</h1>
          <p className="text-slate-gray">Optimize your cloud costs with intelligent analysis</p>
        </div>

        {/* Auth Content */}
        <div className="bg-white rounded-2xl shadow-mist border border-sky-gray p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-gray">
          <p>&copy; 2024 AI Cost Optimizer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 