import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'officer',
    panchayat: '',
    aadhaar: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
    category: '',
    income: '',
    education: '',
    hasHouse: false,
    landSize: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare data based on role
      let data = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };
      if (form.role === 'resident') {
        data = {
          ...data,
          aadhaar: form.aadhaar,
          phone: form.phone,
          address: form.address,
          age: form.age,
          gender: form.gender,
          category: form.category,
          income: form.income,
          education: form.education,
          hasHouse: form.hasHouse,
          landSize: form.landSize
        };
      } else {
        data = {
          ...data,
          panchayat: form.panchayat
        };
      }
      await axios.post('/api/auth/register', data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-xl font-bold mb-4">User Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="input-field" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="input-field" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="input-field" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select className="input-field" name="role" value={form.role} onChange={handleChange} required>
          <option value="officer">Panchayat Officer</option>
          <option value="admin">Admin</option>
          <option value="resident">Resident</option>
        </select>
        {(form.role === 'officer' || form.role === 'admin') && (
          <input className="input-field" name="panchayat" placeholder="Panchayat Name" value={form.panchayat} onChange={handleChange} required />
        )}
        {form.role === 'resident' && (
          <>
            <input className="input-field" name="aadhaar" placeholder="Aadhaar Number" value={form.aadhaar} onChange={handleChange} required />
            <input className="input-field" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
            <input className="input-field" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
            <input className="input-field" name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
            <select className="input-field" name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select className="input-field" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
            </select>
            <input className="input-field" name="income" type="number" placeholder="Annual Income" value={form.income} onChange={handleChange} required />
            <input className="input-field" name="education" placeholder="Education" value={form.education} onChange={handleChange} />
            <label className="flex items-center">
              <input type="checkbox" name="hasHouse" checked={form.hasHouse} onChange={handleChange} />
              <span className="ml-2">Owns a House</span>
            </label>
            <input className="input-field" name="landSize" type="number" placeholder="Land Size (acres)" value={form.landSize} onChange={handleChange} />
          </>
        )}
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register; 