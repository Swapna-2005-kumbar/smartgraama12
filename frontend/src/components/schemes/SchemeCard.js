import React from 'react';

const SchemeCard = ({ scheme, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getProgressPercentage = () => {
    if (!scheme.targetBeneficiaries) return 0;
    return Math.min((scheme.beneficiaries / scheme.targetBeneficiaries) * 100, 100);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{scheme.name}</h3>
          <p className="text-sm text-gray-500">{scheme.category}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 line-clamp-2">{scheme.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scheme.status)}`}>
            {scheme.status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Budget:</span>
          <span className="text-sm font-medium">₹{scheme.budget?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Utilized:</span>
          <span className="text-sm font-medium">₹{scheme.utilized?.toLocaleString() || '0'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Beneficiaries:</span>
          <span className="text-sm font-medium">
            {scheme.beneficiaries || 0} / {scheme.targetBeneficiaries}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Progress: {getProgressPercentage().toFixed(1)}%</span>
          <span>Utilization: {scheme.budget ? ((scheme.utilized || 0) / scheme.budget * 100).toFixed(1) : 0}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Start Date:</span>
          <span className="text-sm font-medium">{formatDate(scheme.startDate)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">End Date:</span>
          <span className="text-sm font-medium">{formatDate(scheme.endDate)}</span>
        </div>

        {/* Eligibility Criteria Summary */}
        {scheme.eligibilityCriteria && (
          <div className="pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Eligibility:</span>
            <div className="mt-1 space-y-1">
              {scheme.eligibilityCriteria.maxIncome && (
                <div className="text-xs text-gray-500">
                  Max Income: ₹{scheme.eligibilityCriteria.maxIncome.toLocaleString()}
                </div>
              )}
              {scheme.eligibilityCriteria.ageMin && scheme.eligibilityCriteria.ageMax && (
                <div className="text-xs text-gray-500">
                  Age: {scheme.eligibilityCriteria.ageMin}-{scheme.eligibilityCriteria.ageMax} years
                </div>
              )}
              {scheme.eligibilityCriteria.categories && scheme.eligibilityCriteria.categories.length > 0 && (
                <div className="text-xs text-gray-500">
                  Categories: {scheme.eligibilityCriteria.categories.join(', ')}
                </div>
              )}
              {scheme.eligibilityCriteria.mustNotHaveHouse && (
                <div className="text-xs text-gray-500">
                  Must not own house
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeCard; 