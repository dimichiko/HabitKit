// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './shared/context/UserContext';
import { PrivateRoute, ProtectedAppRoute, PublicRoute } from './shared/components/PrivateRoute';
import HomePage from './pages/HomePage';
import './index.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-500">Cargando aplicación...</p>
    </div>
  </div>
);

// Lazy loading de apps internas
const InvoiceKitApp = lazy(() => import('./apps/invoicekit/screens/InvoiceKitApp'));
const CalorieKitApp = lazy(() => import('./apps/caloriekit/screens/CalorieKitApp'));
const HabitKitApp = lazy(() => import('./apps/habitkit/screens/HabitKitApp'));
const TrainingKitApp = lazy(() => import('./apps/trainingkit/TrainingKitApp'));
// Lazy loading de páginas públicas y privadas
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const TwoFactorAuthPage = lazy(() => import('./pages/TwoFactorAuthPage'));
const AppSelectorPage = lazy(() => import('./AppSelectorPage'));
const TrainingKitProductPage = lazy(() => import('./pages/TrainingKitProductPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const IdeasPage = lazy(() => import('./pages/IdeasPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Lifehub - Simplifica tu rutina con apps modulares</title>
        <meta name="description" content="Lifehub: apps para hábitos, calorías, facturación y entrenos. Todo en un solo lugar, sin distracciones." />
        <meta name="keywords" content="hábitos, calorías, facturación, entrenos, productividad, apps, lifehub" />
        <meta property="og:title" content="Lifehub - Simplifica tu rutina" />
        <meta property="og:description" content="Apps para hábitos, calorías, facturación y entrenos. Todo en un solo lugar." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lifehub.app" />
        <meta property="og:image" content="/favicon-kit.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lifehub - Simplifica tu rutina" />
        <meta name="twitter:description" content="Apps para hábitos, calorías, facturación y entrenos. Todo en un solo lugar." />
        <meta name="twitter:image" content="/favicon-kit.png" />
      </Helmet>
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Suspense fallback={<LoadingSpinner />}><PublicRoute><LoginPage /></PublicRoute></Suspense>} />
              <Route path="/register" element={<Suspense fallback={<LoadingSpinner />}><PublicRoute><RegisterPage /></PublicRoute></Suspense>} />
              <Route path="/verify-email" element={<Suspense fallback={<LoadingSpinner />}><PublicRoute><VerifyEmailPage /></PublicRoute></Suspense>} />
              <Route path="/trainingkit" element={<Suspense fallback={<LoadingSpinner />}><TrainingKitProductPage /></Suspense>} />
              <Route path="/pricing" element={<Suspense fallback={<LoadingSpinner />}><PricingPage /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={<LoadingSpinner />}><AboutPage /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<LoadingSpinner />}><ContactPage /></Suspense>} />
              <Route path="/privacy" element={<Suspense fallback={<LoadingSpinner />}><PrivacyPage /></Suspense>} />
              <Route path="/terms" element={<Suspense fallback={<LoadingSpinner />}><TermsPage /></Suspense>} />
              <Route path="/reset-password" element={<Suspense fallback={<LoadingSpinner />}><PublicRoute><ResetPasswordPage /></PublicRoute></Suspense>} />
              <Route path="/ideas" element={<Suspense fallback={<LoadingSpinner />}><IdeasPage /></Suspense>} />
            
            {/* Rutas protegidas */}
              <Route path="/account" element={<Suspense fallback={<LoadingSpinner />}><PrivateRoute><AccountPage /></PrivateRoute></Suspense>} />
              <Route path="/account/:tab" element={<Suspense fallback={<LoadingSpinner />}><PrivateRoute><AccountPage /></PrivateRoute></Suspense>} />
              <Route path="/apps" element={<Suspense fallback={<LoadingSpinner />}><PrivateRoute><AppSelectorPage /></PrivateRoute></Suspense>} />
              <Route path="/setup-2fa" element={<Suspense fallback={<LoadingSpinner />}><PrivateRoute><TwoFactorAuthPage /></PrivateRoute></Suspense>} />
              <Route path="/checkout" element={<Suspense fallback={<LoadingSpinner />}><PrivateRoute><CheckoutPage /></PrivateRoute></Suspense>} />
            
            {/* Rutas de apps con control de acceso por plan */}
            <Route 
              path="/habitkit/*" 
              element={
                <ProtectedAppRoute appName="habitkit">
                  <Suspense fallback={<LoadingSpinner />}>
                    <HabitKitApp />
                  </Suspense>
                </ProtectedAppRoute>
              } 
            />
            
            <Route 
              path="/caloriekit" 
              element={
                <ProtectedAppRoute appName="caloriekit">
                  <Suspense fallback={<LoadingSpinner />}>
                    <CalorieKitApp />
                  </Suspense>
                </ProtectedAppRoute>
              } 
            />
            
            <Route 
              path="/invoicekit" 
              element={
                <ProtectedAppRoute appName="invoicekit">
                  <Suspense fallback={<LoadingSpinner />}>
                    <InvoiceKitApp />
                  </Suspense>
                </ProtectedAppRoute>
              } 
            />
            
            <Route 
              path="/trainingkit-app" 
              element={
                <ProtectedAppRoute appName="trainingkit">
                  <Suspense fallback={<LoadingSpinner />}>
                    <TrainingKitApp />
                  </Suspense>
                </ProtectedAppRoute>
              } 
            />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
    </HelmetProvider>
  );
}

export default App;