import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

export default function MainLayout() {
  const { logout } = useAuth();
  const user = useSelector(state => state.user.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckCircle2" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {user?.emailAddress || 'User'}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <ApperIcon name="LogOut" size={18} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet context={{ logout, user }} />
      </main>

      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light" 
      />
    </div>
  );
}