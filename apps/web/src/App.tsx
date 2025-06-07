import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';
import { ThemeProvider } from './Components/theme-provider';
import VerifyEmailPage from './pages/VerifyEmail';
import LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          {/* Add more routes for your questionnaire pages here */}
        </Routes>
      </Router>
      <Toaster position="top-center"/>
    </ThemeProvider>
  )
}

export default App;