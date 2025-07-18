import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalSchemes: 0,
    pendingApplications: 0,
    approvedBeneficiaries: 0
  });
  const [schemeData, setSchemeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appStats, setAppStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const { user } = useAuth();
  const [myApplications, setMyApplications] = useState([]);
  const [lastNotified, setLastNotified] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchApplicationStats();
    if (user?.role === 'resident') {
      fetchMyApplications();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'resident' && myApplications.length > 0) {
      myApplications.forEach(app => {
        if ((app.status === 'Approved' || app.status === 'Rejected') && lastNotified[app._id] !== app.status) {
          toast.info(`Your application for ${app.scheme?.name} was ${app.status}${app.reviewComment ? ': ' + app.reviewComment : ''}`);
          setLastNotified(prev => ({ ...prev, [app._id]: app.status }));
        }
      });
    }
  }, [myApplications, user]);

  const fetchDashboardData = async () => {
    try {
      const [residentsRes, schemesRes] = await Promise.all([
        axios.get('/api/residents'),
        axios.get('/api/schemes')
      ]);

      const residents = residentsRes.data;
      const schemes = schemesRes.data;

      // Calculate statistics
      const totalResidents = residents.length;
      const totalSchemes = schemes.length;
      const pendingApplications = residents.filter(r => r.status === 'Pending').length;
      const approvedBeneficiaries = residents.filter(r => r.schemes && r.schemes.length > 0).length;

      setStats({
        totalResidents,
        totalSchemes,
        pendingApplications,
        approvedBeneficiaries
      });

      // Prepare chart data
      const schemeChartData = schemes.map(scheme => ({
        name: scheme.name,
        beneficiaries: scheme.beneficiaries || 0,
        target: scheme.targetBeneficiaries || 0
      }));

      setSchemeData(schemeChartData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const res = await axios.get('/api/schemes/applications');
      const total = res.data.length;
      const approved = res.data.filter(a => a.status === 'Approved').length;
      const rejected = res.data.filter(a => a.status === 'Rejected').length;
      const pending = res.data.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;
      setAppStats({ total, approved, rejected, pending });
    } catch {}
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get('/api/schemes/applications');
      const mine = res.data.filter(app => app.resident?._id === user._id);
      setMyApplications(mine);
    } catch {}
  };

  const barChartData = {
    labels: schemeData.map(s => s.name),
    datasets: [
      {
        label: 'Current Beneficiaries',
        data: schemeData.map(s => s.beneficiaries),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Target Beneficiaries',
        data: schemeData.map(s => s.target),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Approved', 'Pending', 'Not Applied'],
    datasets: [
      {
        data: [
          stats.approvedBeneficiaries,
          stats.pendingApplications,
          stats.totalResidents - stats.approvedBeneficiaries - stats.pendingApplications
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([fetchDashboardData(), fetchApplicationStats()]).finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your Panchayat management system</p>
        <button className="btn-primary mt-2" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResidents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Schemes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSchemes}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approvedBeneficiaries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{appStats.total}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Applications</p>
              <p className="text-2xl font-bold text-gray-900">{appStats.approved}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected Applications</p>
              <p className="text-2xl font-bold text-gray-900">{appStats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{appStats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resident Application History */}
      {user?.role === 'resident' && (
        <div className="card mt-8">
          <h2 className="text-lg font-bold mb-4">My Application History</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th>Scheme</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Review Comment</th>
              </tr>
            </thead>
            <tbody>
              {myApplications.map(app => (
                <tr key={app._id}>
                  <td>{app.scheme?.name}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>{app.status}</td>
                  <td>{app.reviewComment || '-'}</td>
                </tr>
              ))}
              {myApplications.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheme Performance</h3>
          <div className="h-64">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
          <div className="h-64">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 