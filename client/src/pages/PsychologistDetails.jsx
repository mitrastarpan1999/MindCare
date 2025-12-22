import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { psychologistAPI, appointmentAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/?api$/, '');
const resolveImage = (pic, fallbackName = 'Doctor') => {
  if (!pic) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`;
  if (pic.startsWith('http')) return pic;
  if (pic.startsWith('/')) return `${apiBase}${pic}`;
  return pic;
};

export default function PsychologistDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    consultationType: 'online',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchPsychologist();
  }, [id]);

  const fetchPsychologist = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await psychologistAPI.getPsychologistById(id);
      setPsychologist(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch psychologist details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    let newData = {
      ...bookingData,
      [name]: value,
    };

    // Auto-calculate endTime as 60 minutes after startTime
    if (name === 'startTime' && value) {
      try {
        const [hours, minutes] = value.split(':').map(Number);
        let endHour = hours;
        let endMin = minutes + 60;
        
        // Handle minute overflow
        if (endMin >= 60) {
          endHour += Math.floor(endMin / 60);
          endMin = endMin % 60;
        }
        
        // Handle hour overflow (24-hour format)
        if (endHour >= 24) {
          endHour = endHour % 24;
        }
        
        const endHours = String(endHour).padStart(2, '0');
        const endMinutes = String(endMin).padStart(2, '0');
        newData.endTime = `${endHours}:${endMinutes}`;
      } catch (error) {
        console.error('Error calculating end time:', error);
        // Fallback: set endTime to same as startTime if calculation fails
        newData.endTime = value;
      }
    }

    setBookingData(newData);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'patient') {
      alert('Only patients can book appointments');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      // Validate booking data
      if (!bookingData.appointmentDate || !bookingData.startTime) {
        setBookingError('Please fill in Date and Start Time');
        setBookingLoading(false);
        return;
      }

      // If endTime is not set, calculate it
      let endTime = bookingData.endTime;
      if (!endTime) {
        const [hours, minutes] = bookingData.startTime.split(':').map(Number);
        let endHour = hours;
        let endMin = minutes + 60;
        
        if (endMin >= 60) {
          endHour += Math.floor(endMin / 60);
          endMin = endMin % 60;
        }
        
        if (endHour >= 24) {
          endHour = endHour % 24;
        }
        
        endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
      }

      // Create appointment
      const appointmentResponse = await appointmentAPI.createAppointment({
        psychologistId: id,
        appointmentDate: bookingData.appointmentDate,
        startTime: bookingData.startTime,
        endTime: endTime,
        consultationType: bookingData.consultationType,
        notes: bookingData.notes,
      });

      console.log('🎯 Appointment created:', appointmentResponse.data);

      // No online payment: just confirm booking and navigate
      navigate('/patient/appointments');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book appointment';
      setBookingError(errorMessage);
      console.error('Booking error:', err.response?.data || err);
      console.error('Full error object:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom text-center py-12">
        <p style={{ color: 'var(--text-dark, #2d2d2d)' }}>Loading...</p>
      </div>
    );
  }

  if (error || !psychologist) {
    return (
      <div className="container-custom text-center py-12">
        <p className="text-red-600">{error || 'Psychologist not found'}</p>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-gray-200 h-48 rounded-lg mb-4 overflow-hidden">
                <img
                  src={resolveImage(psychologist.profilePicture, psychologist.fullName)}
                  alt={psychologist.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{psychologist.fullName}</h1>
              {psychologist.qualifications && (
                <p className="mb-4" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>{psychologist.qualifications}</p>
              )}

              <div className="space-y-2 mb-6" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                {psychologist.yearsExperience && (
                  <p>
                    <span className="font-semibold">Experience:</span> {psychologist.yearsExperience} years
                  </p>
                )}
                {psychologist.clinicAddress && (
                  <p>
                    <span className="font-semibold">Address:</span> {psychologist.clinicAddress}
                  </p>
                )}
                {psychologist.phone && (
                  <p>
                    <span className="font-semibold">Phone:</span> {psychologist.phone}
                  </p>
                )}
              </div>

              <p className="text-2xl font-bold mb-6" style={{ color: 'var(--primary-color)' }}>
                Consultation Fee: {formatCurrency(psychologist.consultationFee)}
              </p>

              <button
                onClick={() => {
                  setShowBooking(!showBooking);
                  if (!showBooking) {
                    setBookingError(''); // Clear error when opening booking form
                  }
                }}
                className="btn-primary"
              >
                {showBooking ? 'Cancel Booking' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>

        {showBooking && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Book an Appointment</h2>

            {bookingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={bookingData.appointmentDate}
                    onChange={handleBookingChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleBookingChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleBookingChange}
                    className="input-field bg-gray-100"
                    disabled
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.6 }}>Auto-calculated as 60 minutes</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Consultation Type</label>
                  <select
                    name="consultationType"
                    value={bookingData.consultationType}
                    onChange={handleBookingChange}
                    className="input-field"
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Additional Notes</label>
                <textarea
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleBookingChange}
                  className="input-field"
                  placeholder="Tell the doctor about your concerns"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn-primary disabled:opacity-50"
              >
                {bookingLoading ? 'Processing...' : `Proceed to Payment - ${formatCurrency(psychologist.consultationFee)}`}
              </button>
            </form>
          </div>
        )}

        {psychologist.availabilities && psychologist.availabilities.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {psychologist.availabilities.map((availability) => (
                <div key={availability.id} className="border rounded-lg p-4" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="font-semibold" style={{ color: 'var(--primary-color)' }}>{availability.dayOfWeek}</p>
                  <p className="text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>
                    {availability.startTime} - {availability.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
