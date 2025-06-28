import React from 'react';

const ResidentCard = ({ resident, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'SC':
        return 'bg-purple-100 text-purple-800';
      case 'ST':
        return 'bg-indigo-100 text-indigo-800';
      case 'OBC':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{resident.name}</h3>
          <p className="text-sm text-gray-500">Aadhaar: {resident.aadhaar}</p>
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
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Age:</span>
          <span className="text-sm font-medium">{resident.age} years</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Gender:</span>
          <span className="text-sm font-medium">{resident.gender}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Phone:</span>
          <span className="text-sm font-medium">{resident.phone}</span>
        </div>

        {resident.email && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm font-medium truncate max-w-32">{resident.email}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Income:</span>
          <span className="text-sm font-medium">₹{resident.income?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Category:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(resident.category)}`}>
            {resident.category}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resident.status)}`}>
            {resident.status}
          </span>
        </div>

        {resident.education && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Education:</span>
            <span className="text-sm font-medium truncate max-w-32">{resident.education}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">House:</span>
          <span className="text-sm font-medium">
            {resident.hasHouse ? 'Owns' : 'Rents/None'}
          </span>
        </div>

        {resident.landSize > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Land:</span>
            <span className="text-sm font-medium">{resident.landSize} acres</span>
          </div>
        )}

        {resident.schemes && resident.schemes.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Schemes:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {resident.schemes.map((scheme, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                >
                  {scheme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 truncate" title={resident.address}>
          📍 {resident.address}
        </p>
      </div>
    </div>
  );
};

export default ResidentCard; 