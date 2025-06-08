import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';
import { ThemeProvider } from './Components/theme-provider';
import VerifyEmailPage from './pages/VerifyEmail';
import LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from "@/Components/ui/sonner";
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
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
      <Toaster position="top-center"/>
    </ThemeProvider>
  )
}

export default App;