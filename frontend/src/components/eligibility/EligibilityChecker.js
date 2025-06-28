import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EligibilityChecker = () => {
  const [residents, setResidents] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [allResults, setAllResults] = useState([]);

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
                    <span className="text-xl">{getEligibilityIcon(result.eligible)}</span>
                    <div>
                      <h4 className="font-medium">{result.scheme.name}</h4>
                      <p className="text-sm opacity-75">{result.scheme.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEligibilityColor(result.eligible)}`}>
                      {result.eligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>
                <p className="text-sm mt-2">{result.reason}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Schemes:</span>
                <span className="ml-2 font-medium">{allResults.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Eligible:</span>
                <span className="ml-2 font-medium text-green-600">
                  {allResults.filter(r => r.eligible).length}
                </span>
              </div>
            </div>
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
    </div>
  );
};

export default EligibilityChecker; 