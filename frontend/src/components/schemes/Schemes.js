import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SchemeForm from './SchemeForm';
import SchemeCard from './SchemeCard';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get('/api/schemes');
      setSchemes(response.data);
    } catch (error) {
      toast.error('Failed to load schemes');
      console.error('Fetch schemes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScheme = async (schemeData) => {
    try {
      const response = await axios.post('/api/schemes', schemeData);
      setSchemes([...schemes, response.data]);
      setShowForm(false);
      toast.success('Scheme added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add scheme');
    }
  };

  const handleUpdateScheme = async (id, schemeData) => {
    try {
      const response = await axios.put(`/api/schemes/${id}`, schemeData);
      setSchemes(schemes.map(s => s._id === id ? response.data : s));
      setEditingScheme(null);
      toast.success('Scheme updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update scheme');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await axios.delete(`/api/schemes/${id}`);
        setSchemes(schemes.filter(s => s._id !== id));
        toast.success('Scheme deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete scheme');
      }
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scheme.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schemes</h1>
          <p className="text-gray-600">Manage government schemes and their eligibility criteria</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          Add New Scheme
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              className="input-field"
              placeholder="Search by scheme name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="form-label">Filter by Status</label>
            <select
              id="status"
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <SchemeCard
            key={scheme._id}
            scheme={scheme}
            onEdit={() => setEditingScheme(scheme)}
            onDelete={() => handleDeleteScheme(scheme._id)}
          />
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schemes found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first scheme'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {(showForm || editingScheme) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingScheme ? 'Edit Scheme' : 'Add New Scheme'}
              </h3>
              <SchemeForm
                scheme={editingScheme}
                onSubmit={editingScheme ? handleUpdateScheme : handleAddScheme}
                onCancel={() => {
                  setShowForm(false);
                  setEditingScheme(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes; 