import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Residents from './components/residents/Residents';
import Schemes from './components/schemes/Schemes';
import EligibilityChecker from './components/eligibility/EligibilityChecker';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/residents" element={
              <PrivateRoute>
                <Layout>
                  <Residents />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/schemes" element={
              <PrivateRoute>
                <Layout>
                  <Schemes />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/eligibility" element={
              <PrivateRoute>
                <Layout>
                  <EligibilityChecker />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 