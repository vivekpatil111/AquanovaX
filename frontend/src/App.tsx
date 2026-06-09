// Main App Router — AquanovaX
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage, OTPPage, ResetPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/theme/muiTheme';

// Customer pages
import { CustomerDashboard } from '@/pages/customer/CustomerDashboard';
import { MarketplacePage } from '@/pages/customer/MarketplacePage';
import { SupplierProfilePage } from '@/pages/customer/SupplierProfilePage';
import { BookingPage } from '@/pages/customer/BookingPage';
import { OrdersPage, TrackingPage, PaymentsPage, WalletPage, ReviewsPage } from '@/pages/customer/CustomerPages';
import { CustomerWaterQualityPage } from '@/pages/customer/CustomerWaterQualityPage';

// Supplier pages
import {
  SupplierDashboard, SupplierOrdersPage, TankerManagementPage,
  WaterQualityPage, SupplierAnalyticsPage, SupplierProfileManagementPage,
} from '@/pages/supplier/SupplierPages';

import { KYCOnboarding } from '@/pages/supplier/KYCOnboarding';

// Driver pages
import {
  DriverDashboard, DeliveryManagementPage, RoutePage, DriverPerformancePage,
} from '@/pages/driver/DriverPages';

// Admin pages
import {
  AdminDashboard, UserManagementPage, SupplierManagementPage,
  DriverManagementPage, OrderMonitoringPage, ComplaintManagementPage,
  SystemAnalyticsPage, AquaMatchDashboard, AdminQualityPage
} from '@/pages/admin/AdminPages';
import { DispatchDashboard } from '@/pages/admin/DispatchDashboard';
import { FleetAnalytics } from '@/pages/admin/FleetAnalytics';

import type { Role } from '@/types';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Role[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirect = { customer: '/customer', supplier: '/supplier', driver: '/driver', admin: '/admin' };
    return <Navigate to={redirect[user.role]} replace />;
  }
  return <>{children}</>;
}

export function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/signup"          element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp"             element={<OTPPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />

        {/* Root redirect */}
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={`/${user?.role ?? 'customer'}`} replace />
            : <Navigate to="/login" replace />
        } />

        {/* ── CUSTOMER PORTAL ── */}
        <Route path="/customer/*" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ThemeProvider theme={muiTheme}>
              <AppShell title="Customer Portal" />
            </ThemeProvider>
          </ProtectedRoute>
        }>
          <Route index                    element={<CustomerDashboard />} />
          <Route path="marketplace"        element={<MarketplacePage />} />
          <Route path="supplier/:id"       element={<SupplierProfilePage />} />
          <Route path="book"              element={<BookingPage />} />
          <Route path="orders"            element={<OrdersPage />} />
          <Route path="track"             element={<TrackingPage />} />
          <Route path="payments"          element={<PaymentsPage />} />
          <Route path="wallet"            element={<WalletPage />} />
          <Route path="reviews"           element={<ReviewsPage />} />
          <Route path="quality"           element={<CustomerWaterQualityPage />} />
        </Route>

        {/* ── SUPPLIER PORTAL ── */}
        <Route path="/supplier" element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <AppShell title="Supplier Portal" />
          </ProtectedRoute>
        }>
          <Route index               element={<SupplierDashboard />} />
          <Route path="kyc"          element={<KYCOnboarding />} />
          <Route path="orders"       element={<SupplierOrdersPage />} />
          <Route path="tankers"      element={<TankerManagementPage />} />
          <Route path="quality"      element={<WaterQualityPage />} />
          <Route path="analytics"    element={<SupplierAnalyticsPage />} />
          <Route path="profile"      element={<SupplierProfileManagementPage />} />
        </Route>

        {/* ── DRIVER PORTAL ── */}
        <Route path="/driver" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <AppShell title="Driver Portal" />
          </ProtectedRoute>
        }>
          <Route index               element={<DriverDashboard />} />
          <Route path="deliveries"   element={<DeliveryManagementPage />} />
          <Route path="route"        element={<RoutePage />} />
          <Route path="performance"  element={<DriverPerformancePage />} />
        </Route>

        {/* ── ADMIN PORTAL ── */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppShell title="Admin Portal" />
          </ProtectedRoute>
        }>
          <Route index                element={<AdminDashboard />} />
          <Route path="dispatch"      element={<DispatchDashboard />} />
          <Route path="network"       element={<SupplierManagementPage />} />
          <Route path="quality"       element={<AdminQualityPage />} />
          <Route path="aquamatch"     element={<AquaMatchDashboard />} />
          <Route path="orders"        element={<OrderMonitoringPage />} />
          <Route path="analytics"     element={<SystemAnalyticsPage />} />
          <Route path="users"         element={<UserManagementPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
