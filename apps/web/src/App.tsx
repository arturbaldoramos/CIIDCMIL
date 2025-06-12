import { lazy, Suspense } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Components/theme-provider';
import { Toaster } from "@/Components/ui/sonner";
import ProtectedRoute from './Components/ProtectedRoute';
import { VerificationProvider } from './context/VerificationProvider';
import { VerificationDialog } from './Components/VerificationDialog';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const WelcomePage = lazy(() => import('./pages/WelcomePage').then(module => ({ default: module.WelcomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));

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
                    <Dashboard />
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