import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from './components/ProtectedRoute';
import { VerificationProvider } from './context/VerificationProvider';
import { VerificationDialog } from './components/VerificationDialog';
import { UserProvider } from './context/UserProvider';
import DashboardLayout from './components/DashboardLayout';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { Dashboard } from './pages/Dashboard';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const WelcomePage = lazy(() => import('./pages/WelcomePage').then(module => ({ default: module.WelcomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <VerificationProvider>
        <Router>
          <VerificationDialog />
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Carregando...</div>}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Rota Protegida com Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserProvider>
                      <DashboardLayout />
                    </UserProvider>
                  </ProtectedRoute>
                }
              >
                {/* Rota aninhada principal */}
                <Route index element={<Dashboard />} />
                {/* Outras rotas aninhadas */}
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>

            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-center" />
      </VerificationProvider>
    </ThemeProvider>
  )
}

export default App;
