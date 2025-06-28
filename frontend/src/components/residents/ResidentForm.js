import React, { useState, useEffect } from 'react';

const ResidentForm = ({ resident, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    category: 'General',
    income: '',
    education: '',
    hasHouse: false,
    landSize: '0'
  });

  useEffect(() => {
    if (resident) {
      setFormData({
        name: resident.name || '',
        aadhaar: resident.aadhaar || '',
        age: resident.age || '',
        gender: resident.gender || 'Male',
        phone: resident.phone || '',
        email: resident.email || '',
        address: resident.address || '',
        category: resident.category || 'General',
        income: resident.income || '',
        education: resident.education || '',
        hasHouse: resident.hasHouse || false,
        landSize: resident.landSize || '0'
      });
    }
  }, [resident]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      age: parseInt(formData.age),
      income: parseInt(formData.income),
      landSize: parseFloat(formData.landSize)
    };
    
    if (resident) {
      onSubmit(resident._id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="form-label">Full Name *</label>
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
          <label htmlFor="aadhaar" className="form-label">Aadhaar Number *</label>
          <input
            type="text"
            id="aadhaar"
            name="aadhaar"
            required
            className="input-field"
            placeholder="12-digit Aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="age" className="form-label">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            required
            min="0"
            max="120"
            className="input-field"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="gender" className="form-label">Gender *</label>
          <select
            id="gender"
            name="gender"
            required
            className="input-field"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="input-field"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="form-label">Address *</label>
          <textarea
            id="address"
            name="address"
            required
            rows="3"
            className="input-field"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="form-label">Category *</label>
          <select
            id="category"
            name="category"
            required
            className="input-field"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="General">General</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
          </select>
        </div>

        <div>
          <label htmlFor="income" className="form-label">Annual Income (₹) *</label>
          <input
            type="number"
            id="income"
            name="income"
            required
            min="0"
            className="input-field"
            placeholder="Annual income in rupees"
            value={formData.income}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="education" className="form-label">Education</label>
          <input
            type="text"
            id="education"
            name="education"
            className="input-field"
            placeholder="e.g., 10th, 12th, Graduation"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="landSize" className="form-label">Land Size (acres)</label>
          <input
            type="number"
            id="landSize"
            name="landSize"
            min="0"
            step="0.01"
            className="input-field"
            value={formData.landSize}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasHouse"
            name="hasHouse"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={formData.hasHouse}
            onChange={handleChange}
          />
          <label htmlFor="hasHouse" className="ml-2 block text-sm text-gray-900">
            Owns a house
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
          {resident ? 'Update Resident' : 'Add Resident'}
        </button>
      </div>
    </form>
  );
};

export default ResidentForm; 