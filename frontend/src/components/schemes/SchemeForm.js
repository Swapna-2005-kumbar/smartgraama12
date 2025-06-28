import React, { useState, useEffect } from 'react';

const SchemeForm = ({ scheme, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    budget: '',
    targetBeneficiaries: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    eligibilityCriteria: {
      maxIncome: '',
      ageMin: '',
      ageMax: '',
      categories: [],
      mustNotHaveHouse: false,
      maxLandSize: ''
    }
  });

  useEffect(() => {
    if (scheme) {
      setFormData({
        name: scheme.name || '',
        description: scheme.description || '',
        category: scheme.category || '',
        budget: scheme.budget || '',
        targetBeneficiaries: scheme.targetBeneficiaries || '',
        startDate: scheme.startDate ? new Date(scheme.startDate).toISOString().split('T')[0] : '',
        endDate: scheme.endDate ? new Date(scheme.endDate).toISOString().split('T')[0] : '',
        status: scheme.status || 'Active',
        eligibilityCriteria: {
          maxIncome: scheme.eligibilityCriteria?.maxIncome || '',
          ageMin: scheme.eligibilityCriteria?.ageMin || '',
          ageMax: scheme.eligibilityCriteria?.ageMax || '',
          categories: scheme.eligibilityCriteria?.categories || [],
          mustNotHaveHouse: scheme.eligibilityCriteria?.mustNotHaveHouse || false,
          maxLandSize: scheme.eligibilityCriteria?.maxLandSize || ''
        }
      });
    }
  }, [scheme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('eligibility.')) {
      const eligibilityField = name.split('.')[1];
      setFormData({
        ...formData,
        eligibilityCriteria: {
          ...formData.eligibilityCriteria,
          [eligibilityField]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const updatedCategories = checked
      ? [...formData.eligibilityCriteria.categories, value]
      : formData.eligibilityCriteria.categories.filter(cat => cat !== value);
    
    setFormData({
      ...formData,
      eligibilityCriteria: {
        ...formData.eligibilityCriteria,
        categories: updatedCategories
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      budget: parseInt(formData.budget),
      targetBeneficiaries: parseInt(formData.targetBeneficiaries),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      eligibilityCriteria: {
        ...formData.eligibilityCriteria,
        maxIncome: formData.eligibilityCriteria.maxIncome ? parseInt(formData.eligibilityCriteria.maxIncome) : null,
        ageMin: formData.eligibilityCriteria.ageMin ? parseInt(formData.eligibilityCriteria.ageMin) : null,
        ageMax: formData.eligibilityCriteria.ageMax ? parseInt(formData.eligibilityCriteria.ageMax) : null,
        maxLandSize: formData.eligibilityCriteria.maxLandSize ? parseFloat(formData.eligibilityCriteria.maxLandSize) : null
      }
    };
    
    if (scheme) {
      onSubmit(scheme._id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="form-label">Scheme Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="input-field"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="form-label">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            required
            className="input-field"
            placeholder="e.g., Housing, Education, Health"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea
            id="description"
            name="description"
            required
            rows="3"
            className="input-field"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="budget" className="form-label">Budget (₹) *</label>
          <input
            type="number"
            id="budget"
            name="budget"
            required
            min="0"
            className="input-field"
            placeholder="Total budget in rupees"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="targetBeneficiaries" className="form-label">Target Beneficiaries *</label>
          <input
            type="number"
            id="targetBeneficiaries"
            name="targetBeneficiaries"
            required
            min="1"
            className="input-field"
            placeholder="Number of target beneficiaries"
            value={formData.targetBeneficiaries}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="startDate" className="form-label">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            className="input-field"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="form-label">End Date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            className="input-field"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            className="input-field"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Eligibility Criteria Section */}
      <div className="border-t pt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Eligibility Criteria</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxIncome" className="form-label">Maximum Income (₹)</label>
            <input
              type="number"
              id="maxIncome"
              name="eligibility.maxIncome"
              min="0"
              className="input-field"
              placeholder="Maximum annual income"
              value={formData.eligibilityCriteria.maxIncome}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="maxLandSize" className="form-label">Maximum Land Size (acres)</label>
            <input
              type="number"
              id="maxLandSize"
              name="eligibility.maxLandSize"
              min="0"
              step="0.01"
              className="input-field"
              placeholder="Maximum land ownership"
              value={formData.eligibilityCriteria.maxLandSize}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="ageMin" className="form-label">Minimum Age</label>
            <input
              type="number"
              id="ageMin"
              name="eligibility.ageMin"
              min="0"
              max="120"
              className="input-field"
              placeholder="Minimum age requirement"
              value={formData.eligibilityCriteria.ageMin}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="ageMax" className="form-label">Maximum Age</label>
            <input
              type="number"
              id="ageMax"
              name="eligibility.ageMax"
              min="0"
              max="120"
              className="input-field"
              placeholder="Maximum age requirement"
              value={formData.eligibilityCriteria.ageMax}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label">Eligible Categories</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['General', 'SC', 'ST', 'OBC'].map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  name="category"
                  value={category}
                  checked={formData.eligibilityCriteria.categories.includes(category)}
                  onChange={handleCategoryChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="eligibility.mustNotHaveHouse"
              checked={formData.eligibilityCriteria.mustNotHaveHouse}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">Must not own a house</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {scheme ? 'Update Scheme' : 'Add Scheme'}
        </button>
      </div>
    </form>
  );
};

export default SchemeForm; 