import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './shared/context/UserContext';
import { MealProvider } from './apps/caloriekit/context/MealContext';

// Páginas principales
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TwoFactorAuthPage from './pages/TwoFactorAuthPage';
import CheckoutPage from './pages/CheckoutPage';
import FullAccessPage from './pages/FullAccessPage';
import IdeasPage from './pages/IdeasPage';
import TrainingKitProductPage from './pages/TrainingKitProductPage';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';

// Apps
import AppSelectorPage from './pages/AppSelectorPage';
import CalorieKitApp from './apps/caloriekit/screens/CalorieKitApp';
import HabitKitApp from './apps/habitkit/screens/HabitKitApp';
import InvoiceKitApp from './apps/invoicekit/screens/InvoiceKitApp';

// Componentes
import PrivateRoute from './shared/components/PrivateRoute';
import ProtectedAppRoute from './shared/components/ProtectedAppRoute';
import ErrorBoundary from './shared/components/ErrorBoundary';

// Estilos
import './index.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <MealProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/2fa" element={<TwoFactorAuthPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/full-access" element={<FullAccessPage />} />
                <Route path="/ideas" element={<IdeasPage />} />
                <Route path="/training-kit" element={<TrainingKitProductPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="/500" element={<ServerErrorPage />} />

                {/* Rutas protegidas */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/account" 
                  element={
                    <PrivateRoute>
                      <AccountPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/apps" 
                  element={
                    <PrivateRoute>
                      <AppSelectorPage />
                    </PrivateRoute>
                  } 
                />

                {/* Apps */}
                <Route 
                  path="/apps/caloriekit/*" 
                  element={
                    <ProtectedAppRoute appName="caloriekit">
                      <CalorieKitApp />
                    </ProtectedAppRoute>
                  } 
                />
                <Route 
                  path="/apps/habitkit/*" 
                  element={
                    <ProtectedAppRoute appName="habitkit">
                      <HabitKitApp />
                    </ProtectedAppRoute>
                  } 
                />
                <Route 
                  path="/apps/invoicekit/*" 
                  element={
                    <ProtectedAppRoute appName="invoicekit">
                      <InvoiceKitApp />
                    </ProtectedAppRoute>
                  } 
                />

                {/* Ruta por defecto */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        </MealProvider>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App; 