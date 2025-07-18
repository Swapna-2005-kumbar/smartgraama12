import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const EligibilityChecker = () => {
  const [residents, setResidents] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const { user } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyData, setApplyData] = useState({ aadhaar: '', rdNumber: '', rationCardNumber: '' });
  const [applyingSchemeId, setApplyingSchemeId] = useState(null);

  // Admin review UI
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'officer') {
      fetchApplications();
    }
  }, [user]);

  const [applications, setApplications] = useState([]);
  const [reviewingApp, setReviewingApp] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [reviewComment, setReviewComment] = useState('');

  // Notification for applicants
  useEffect(() => {
    if (user?.role === 'resident') {
      fetchMyApplications();
    }
  }, [user]);

  const [myApplications, setMyApplications] = useState([]);
  const [lastNotified, setLastNotified] = useState({});

  useEffect(() => {
    myApplications.forEach(app => {
      if ((app.status === 'Approved' || app.status === 'Rejected') && lastNotified[app._id] !== app.status) {
        toast.info(`Your application for ${app.scheme?.name} was ${app.status}${app.reviewComment ? ': ' + app.reviewComment : ''}`);
        setLastNotified(prev => ({ ...prev, [app._id]: app.status }));
      }
    });
  }, [myApplications]);

  // Admin filter/search
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResident, setFilterResident] = useState('');
  const [filterScheme, setFilterScheme] = useState('');
  const filteredApplications = applications.filter(app => {
    const statusMatch = filterStatus === 'all' || app.status === filterStatus;
    const residentMatch = !filterResident || app.resident?._id === filterResident;
    const schemeMatch = !filterScheme || app.scheme?._id === filterScheme;
    return statusMatch && residentMatch && schemeMatch;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [residentsRes, schemesRes] = await Promise.all([
        axios.get('/api/residents'),
        axios.get('/api/schemes')
      ]);
      setResidents(residentsRes.data);
      setSchemes(schemesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Fetch data error:', error);
    }
  };

  const checkEligibility = async () => {
    if (!selectedResident || !selectedScheme) {
      toast.error('Please select both resident and scheme');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/eligibility', {
        residentId: selectedResident,
        schemeId: selectedScheme
      });
      setResult(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check eligibility');
    } finally {
      setLoading(false);
    }
  };

  const checkAllEligibility = async () => {
    if (!selectedResident) {
      toast.error('Please select a resident');
      return;
    }

    setLoading(true);
    try {
      const results = [];
      for (const scheme of schemes) {
        try {
          const response = await axios.post('/api/eligibility', {
            residentId: selectedResident,
            schemeId: scheme._id
          });
          results.push({
            scheme: scheme,
            ...response.data
          });
        } catch (error) {
          results.push({
            scheme: scheme,
            eligible: false,
            reason: 'Error checking eligibility'
          });
        }
      }
      setAllResults(results);
      setShowAllResults(true);
    } catch (error) {
      toast.error('Failed to check all eligibility');
    } finally {
      setLoading(false);
    }
  };

  const getEligibilityColor = (eligible) => {
    return eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getEligibilityIcon = (eligible) => {
    return eligible ? '✅' : '❌';
  };

  const handleApplyChange = (e) => {
    const { name, value } = e.target;
    setApplyData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyData.aadhaar || !applyData.rdNumber || !applyData.rationCardNumber) {
      toast.error('All fields are required');
      return;
    }
    try {
      await axios.post('/api/schemes/applications', {
        residentId: selectedResident,
        schemeId: applyingSchemeId,
        aadhaar: applyData.aadhaar,
        rdNumber: applyData.rdNumber,
        rationCardNumber: applyData.rationCardNumber
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setApplyData({ aadhaar: '', rdNumber: '', rationCardNumber: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/schemes/applications');
      setApplications(res.data);
    } catch {}
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get('/api/schemes/applications');
      const mine = res.data.filter(app => app.resident?._id === user._id);
      setMyApplications(mine);
    } catch {}
  };

  const handleReview = async (id) => {
    try {
      await axios.patch(`/api/schemes/applications/${id}/review`, { status: reviewStatus, reviewComment });
      toast.success('Application reviewed');
      setReviewingApp(null);
      fetchApplications();
    } catch (e) {
      toast.error('Failed to review');
    }
  };

  // Track which scheme is being applied for in all results
  const handleApplyFromAll = (schemeId) => {
    setShowApplyModal(true);
    setApplyingSchemeId(schemeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Eligibility Checker</h1>
        <p className="text-gray-600">Check resident eligibility for government schemes</p>
      </div>

      {/* Selection Form */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="resident" className="form-label">Select Resident</label>
            <select
              id="resident"
              className="input-field"
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
            >
              <option value="">Choose a resident...</option>
              {residents.map((resident) => (
                <option key={resident._id} value={resident._id}>
                  {resident.name} - {resident.aadhaar}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scheme" className="form-label">Select Scheme</label>
            <select
              id="scheme"
              className="input-field"
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
            >
              <option value="">Choose a scheme...</option>
              {schemes.map((scheme) => (
                <option key={scheme._id} value={scheme._id}>
                  {scheme.name} - {scheme.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={checkEligibility}
            disabled={loading || !selectedResident || !selectedScheme}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Eligibility'}
          </button>
          
          <button
            onClick={checkAllEligibility}
            disabled={loading || !selectedResident}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking All...' : 'Check All Schemes'}
          </button>
        </div>
      </div>

      {/* Single Result */}
      {result && !showAllResults && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Result</h3>
          <div className={`p-4 rounded-lg ${getEligibilityColor(result.eligible)}`}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getEligibilityIcon(result.eligible)}</span>
              <div>
                <h4 className="font-medium">
                  {result.eligible ? 'Eligible' : 'Not Eligible'}
                </h4>
                <p className="text-sm mt-1">{result.reason}</p>
              </div>
            </div>
            {result.eligible && (
              <button
                className="btn-primary mt-4"
                onClick={() => { setShowApplyModal(true); setApplyingSchemeId(selectedScheme); }}
              >
                Apply for Scheme
              </button>
            )}
          </div>
        </div>
      )}

      {/* All Results */}
      {showAllResults && allResults.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">All Scheme Results</h3>
            <button
              onClick={() => setShowAllResults(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Show Single Check
            </button>
          </div>
          <div className="space-y-3">
            {allResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getEligibilityColor(result.eligible)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getEligibilityIcon(result.eligible)}</span>
                    <div>
                      <h4 className="font-medium text-lg">{result.scheme.name}</h4>
                      <div className="text-gray-500 text-sm">{result.scheme.description}</div>
                      <div className="text-xs mt-1">{result.reason}</div>
                    </div>
                  </div>
                  {result.eligible && (
                    <button
                      className="btn-primary"
                      onClick={() => handleApplyFromAll(result.scheme._id)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-2xl font-bold text-gray-900">{residents.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {schemes.filter(s => s.status === 'Active').length}
              </p>
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
              <p className="text-sm font-medium text-gray-600">Total Schemes</p>
              <p className="text-2xl font-bold text-gray-900">{schemes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Apply for Scheme</h2>
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="form-label">Aadhaar Number</label>
                <input type="text" name="aadhaar" className="input-field" value={applyData.aadhaar} onChange={handleApplyChange} required />
              </div>
              <div>
                <label className="form-label">RD Number</label>
                <input type="text" name="rdNumber" className="input-field" value={applyData.rdNumber} onChange={handleApplyChange} required />
              </div>
              <div>
                <label className="form-label">Ration Card Number</label>
                <input type="text" name="rationCardNumber" className="input-field" value={applyData.rationCardNumber} onChange={handleApplyChange} required />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" className="btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Application Review UI */}
      {(user?.role === 'admin' || user?.role === 'officer') && (
        <div className="card mt-8">
          <h2 className="text-lg font-bold mb-4">Application Review</h2>
          <div className="flex space-x-2 mb-4">
            <select className="input-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="input-field" value={filterResident} onChange={e => setFilterResident(e.target.value)}>
              <option value="">All Residents</option>
              {residents.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
            <select className="input-field" value={filterScheme} onChange={e => setFilterScheme(e.target.value)}>
              <option value="">All Schemes</option>
              {schemes.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Scheme</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app._id}>
                  <td>{app.resident?.name}</td>
                  <td>{app.scheme?.name}</td>
                  <td>{app.status}</td>
                  <td>
                    <button className="btn-secondary btn-xs mr-2" onClick={() => setReviewingApp(app)}>Review</button>
                    <a href={`/${app.aadhaarFile}`} target="_blank" rel="noopener noreferrer" className="btn-link btn-xs">Aadhaar</a>
                    <a href={`/${app.rdFile}`} target="_blank" rel="noopener noreferrer" className="btn-link btn-xs">RD</a>
                    <a href={`/${app.rationCardFile}`} target="_blank" rel="noopener noreferrer" className="btn-link btn-xs">Ration</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviewingApp && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Review Application</h2>
                <div className="mb-2">Resident: {reviewingApp.resident?.name}</div>
                <div className="mb-2">Scheme: {reviewingApp.scheme?.name}</div>
                <div className="mb-2">Status: {reviewingApp.status}</div>
                <div className="mb-2">Comment:</div>
                <textarea className="input-field w-full" value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
                <div className="flex space-x-2 mt-4">
                  <button className="btn-primary" onClick={() => { setReviewStatus('Approved'); handleReview(reviewingApp._id); }}>Approve</button>
                  <button className="btn-danger" onClick={() => { setReviewStatus('Rejected'); handleReview(reviewingApp._id); }}>Reject</button>
                  <button className="btn-secondary" onClick={() => setReviewingApp(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker; 