import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EligibilityForm() {
  const [residents, setResidents] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedResident, setSelResident] = useState('');
  const [selectedScheme, setSelScheme] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('/api/residents', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setResidents(res.data)).catch(console.error);
    axios.get('/api/schemes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setSchemes(res.data)).catch(console.error);
  }, []);

  const check = () => {
    axios.post('/api/eligibility', {
      residentId: selectedResident,
      schemeId: selectedScheme
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
      .then(res => setResult(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <div className="mb-4">
        <label>Resident:</label>
        <select className="border p-2 w-full" value={selectedResident} onChange={e => setSelResident(e.target.value)}>
          <option value="">Select resident</option>
          {residents.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label>Scheme:</label>
        <select className="border p-2 w-full" value={selectedScheme} onChange={e => setSelScheme(e.target.value)}>
          <option value="">Select scheme</option>
          {schemes.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={check} disabled={!selectedResident || !selectedScheme}>
        Check Eligibility
      </button>
      {result && (
        <div className={`mt-4 p-4 ${result.eligible ? 'bg-green-100' : 'bg-red-100'}`}>
          <p>{result.reason}</p>
        </div>
      )}
    </div>
  );
}

export default EligibilityForm;
