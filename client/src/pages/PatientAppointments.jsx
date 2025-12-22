import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { appointmentAPI } from '../services/api';
import { formatDate } from '../utils/helpers';

export default function PatientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await appointmentAPI.getPatientAppointments(user.id);
      setAppointments(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentAPI.cancelAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="container-custom">
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-dark, #2d2d2d)' }}>My Appointments</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-12">
          <p style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }} className="mb-4">No appointments yet</p>
          <a href="/psychologists" className="btn-primary">
            Browse Psychologists
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.6 }}>Psychologist</p>
                  <p className="font-semibold" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{appointment.psychologist.fullName}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.6 }}>Date & Time</p>
                  <p className="font-semibold" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                    {formatDate(appointment.appointmentDate)} {appointment.startTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.6 }}>Type</p>
                  <p className="font-semibold capitalize" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{appointment.consultationType}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.6 }}>Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      appointment.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>

              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <div className="mt-4 pt-4" style={{ borderTopColor: 'rgba(0,0,0,0.08)', borderTopWidth: '1px' }}>
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="btn-danger"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
