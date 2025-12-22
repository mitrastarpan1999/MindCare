import { useState, useEffect } from 'react';
import { psychologistAPI } from '../services/api';
import PsychologistCard from '../components/PsychologistCard';

export default function PsychologistList() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minFee: '',
    maxFee: '',
  });

  useEffect(() => {
    fetchPsychologists();
  }, [filters]);

  const fetchPsychologists = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.minFee) params.minFee = filters.minFee;
      if (filters.maxFee) params.maxFee = filters.maxFee;

      const response = await psychologistAPI.getAllPsychologists(params);
      setPsychologists(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch psychologists');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredPsychologists = psychologists.filter((psychologist) => {
    if (!searchTerm.trim()) return true;
    const name = psychologist.fullName || '';
    return name.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="container-custom">
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Find a Psychologist</h1>

      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Filter by:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Search by name</label>
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Enter psychologist name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Min Fee (₹)</label>
            <input
              type="number"
              name="minFee"
              value={filters.minFee}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="Min fee"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Max Fee (₹)</label>
            <input
              type="number"
              name="maxFee"
              value={filters.maxFee}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="Max fee"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>Loading psychologists...</p>
        </div>
      ) : psychologists.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>No psychologists found matching your criteria.</p>
        </div>
      ) : filteredPsychologists.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>No psychologists match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPsychologists.map((psychologist) => (
            <PsychologistCard key={psychologist.id} psychologist={psychologist} />
          ))}
        </div>
      )}
    </div>
  );
}
