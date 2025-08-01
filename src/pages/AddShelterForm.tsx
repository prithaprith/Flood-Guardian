import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSafeRoutePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    capacity: '',
  });

  const shelterOptions = [
    'School',
    'College Auditorium',
    'Community Center',
    'Town Hall',
    'Indoor Stadium',
    'Football Field',
    'Cricket Stadium',
    'Railway Station Waiting Area',
    'Bus Terminal',
    'Public Library',
    'University Gymnasium',
    'Public Mosque',
    'Temple Hall',
    'Church Basement',
    'Cyclone Shelter',
    'Union Parishad Office',
    'Municipal Office',
    'Govt. Health Complex',
    'Fire Service HQ',
    'NGO Safe House',
    'Local NGO Office',
    'Covered Market Building',
    'Warehouse Facility',
    'Old Govt Building',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store user shelter in localStorage
    const existing = JSON.parse(localStorage.getItem('userShelters') || '[]');
    const updated = [...existing, formData];
    localStorage.setItem('userShelters', JSON.stringify(updated));

    // ✅ Auto-navigate to HomePage after saving
    navigate('/');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Safe Shelter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Shelter Type</option>
          {shelterOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddSafeRoutePage;
