import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLoginPage } from '../../pages/admin/AdminLoginPage';
import { Loader2 } from 'lucide-react';

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-600 gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg shadow-orange-500/20">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <span className="text-xs font-medium text-slate-500">Authenticating administrative session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return <>{children}</>;
}
