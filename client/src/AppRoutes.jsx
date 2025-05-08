import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/StudentManagement";
import AttendanceManagement from "./pages/AttendanceManagement";
import Reports from "./pages/Reports";
import DepartmentManagement from "./pages/DepartmentManagement";
import SubjectManagement from './pages/SubjectManagement';
import SendEmailAnnouncementPage from './pages/SendEmailAnnouncementPage';
// AnnouncementsPage has been removed
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProfilePage from './pages/AdminProfilePage';
import { useAuth } from '@/context/AuthContext'; // Corrected import path

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes wrapped by Layout and ProtectedRoute */}
        <Route 
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="send-email-announcement" element={
                    <ProtectedRoute isAllowed={userRole === 'ADMIN'}>
                      <SendEmailAnnouncementPage />
                    </ProtectedRoute>
                  } />
                  {/* AnnouncementsPage route has been removed */}
                  <Route path="students" element={<StudentManagement />} />
                  <Route path="attendance" element={<AttendanceManagement />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="departments" element={<DepartmentManagement />} />
                  <Route path="subjects" element={<SubjectManagement />} />
                  <Route path="profile" element={<AdminProfilePage />} />
                  <Route path="*" element={<div>Page Not Found</div>} /> {/* Catch-all for 404 within layout */}
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;