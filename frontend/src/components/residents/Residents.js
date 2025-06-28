import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResidentForm from './ResidentForm';
import ResidentCard from './ResidentCard';

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get('/api/residents');
      setResidents(response.data);
    } catch (error) {
      toast.error('Failed to load residents');
      console.error('Fetch residents error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResident = async (residentData) => {
    try {
      const response = await axios.post('/api/residents', residentData);
      setResidents([...residents, response.data]);
      setShowForm(false);
      toast.success('Resident added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add resident');
    }
  };

  const handleUpdateResident = async (id, residentData) => {
    try {
      const response = await axios.put(`/api/residents/${id}`, residentData);
      setResidents(residents.map(r => r._id === id ? response.data : r));
      setEditingResident(null);
      toast.success('Resident updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update resident');
    }
  };

  const handleDeleteResident = async (id) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await axios.delete(`/api/residents/${id}`);
        setResidents(residents.filter(r => r._id !== id));
        toast.success('Resident deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete resident');
      }
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.aadhaar.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || resident.category === filterCategory;
    return matchesSearch && matchesCategory;
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
          <h1 className="text-2xl font-bold text-gray-900">Residents</h1>
          <p className="text-gray-600">Manage resident records and information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          Add New Resident
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
              placeholder="Search by name or Aadhaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="form-label">Filter by Category</label>
            <select
              id="category"
              className="input-field"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map((resident) => (
          <ResidentCard
            key={resident._id}
            resident={resident}
            onEdit={() => setEditingResident(resident)}
            onDelete={() => handleDeleteResident(resident._id)}
          />
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first resident'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {(showForm || editingResident) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingResident ? 'Edit Resident' : 'Add New Resident'}
              </h3>
              <ResidentForm
                resident={editingResident}
                onSubmit={editingResident ? handleUpdateResident : handleAddResident}
                onCancel={() => {
                  setShowForm(false);
                  setEditingResident(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Residents; 