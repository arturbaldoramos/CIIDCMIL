import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from './components/ProtectedRoute';
import { VerificationProvider } from './context/VerificationProvider';
import { VerificationDialog } from './components/VerificationDialog';
import { Dashboard } from './pages/Dashboard';
import { User } from 'lucide-react';
import { UserProvider } from './context/UserProvider';

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

              {/* Rota Protegida */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserProvider>
                      <Dashboard />
                    </UserProvider>
                  </ProtectedRoute>
                }
              />

            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-center" />
      </VerificationProvider>
    </ThemeProvider>
  )
}

export default App;