import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';
import { ThemeProvider } from './Components/theme-provider';
import LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from "@/Components/ui/sonner";
import ProtectedRoute from './Components/ProtectedRoute';
import { VerificationProvider } from './context/VerificationProvider';
import { VerificationDialog } from './Components/VerificationDialog';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <VerificationProvider>
        <Router>
          <VerificationDialog />
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
        </Router>
        <Toaster position="top-center" />
      </VerificationProvider>
    </ThemeProvider>
  )
}

export default App;