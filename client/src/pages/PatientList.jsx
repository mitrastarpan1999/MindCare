import { useState, useEffect } from 'react';
import { psychologistAPI } from '../services/api';
import PatientCard from '../components/PatientCard';
import { useAuth } from '../hooks/useAuth';

export default function PatientList() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
  });

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');

    try {
      // Get appointments for this psychologist to see their patients
      const response = await psychologistAPI.getMyBookings(user?.id);
      
      // Extract unique patients from appointments
      const patientsMap = new Map();
      if (response.data.data) {
        response.data.data.forEach((appointment) => {
          if (appointment.patient && !patientsMap.has(appointment.patient.id)) {
            patientsMap.set(appointment.patient.id, appointment.patient);
          }
        });
      }
      
      let patientsList = Array.from(patientsMap.values());
      
      // Apply search filter if present
      if (filters.search) {
        patientsList = patientsList.filter(
          (patient) =>
            patient.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
            patient.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setPatients(patientsList);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
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

  return (
    <div className="container-custom">
      <h1 className="text-4xl font-bold mb-8 text-amber-900">My Patients</h1>

      {/* Search Filter */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 text-amber-900">Search Patients</h2>
        <div>
          <label className="block text-sm font-medium mb-2 text-amber-900">Name or Email</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            className="input-field"
            placeholder="Search by name or email"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-2 rounded mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading patients...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-amber-900 opacity-70">No patients found. Patients will appear here once they book appointments with you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
