import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { psychologistAPI, profileAPI } from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';

export default function PsychologistDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [profileError, setProfileError] = useState('');

  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/?api$/, '');
  const resolveImage = (pic, fallbackName = 'Doctor') => {
    if (!pic) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`;
    if (pic.startsWith('http')) return pic;
    if (pic.startsWith('/')) return `${apiBase}${pic}`;
    return pic;
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab]);

  const loadBookings = async () => {
    if (!user?.id) return;
    setBookingsLoading(true);
    setBookingsError('');
    try {
      const res = await psychologistAPI.getMyBookings(user.id);
      setBookings(res.data.data || []);
    } catch (err) {
      setBookingsError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleBookingAction = async (appointmentId, status) => {
    let note = '';
    if (status === 'declined') {
      note = window.prompt('Add a reason for declining (optional):', '') || '';
    }
    try {
      await psychologistAPI.updateBookingStatus(user.id, appointmentId, { status, note });
      await loadBookings();
    } catch (err) {
      setBookingsError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleUploadPicture = async () => {
    if (!profileFile) return;
    setUploadingPic(true);
    setProfileError('');
    try {
      await profileAPI.uploadPsychologistProfilePicture(profileFile);
      setPreviewUrl(null);
      setProfileFile(null);
      window.location.reload();
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to upload picture');
    } finally {
      setUploadingPic(false);
    }
  };

  return (
    <div className="container-custom">
      <h1 className="text-4xl font-bold mb-8">Psychologist Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Welcome</h3>
          <p className="text-gray-700 text-sm">{user?.fullName}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pending Bookings</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Completed Sessions</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {['overview', 'profile', 'availability', 'bookings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <p className="text-gray-700 mb-4">
            Welcome to your psychologist dashboard. Here you can manage your profile, set availability,
            and view your appointments.
          </p>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">Total Consultations:</span> 0 of 0 hours this month
            </p>
            <p>
              <span className="font-semibold">Next Appointment:</span> No upcoming appointments
            </p>
            <p>
              <span className="font-semibold">Profile Status:</span> Active
            </p>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          {profileError && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
              {profileError}
            </div>
          )}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={previewUrl || resolveImage(user?.profilePicture, user?.fullName)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {profileFile && (
                  <button
                    type="button"
                    onClick={handleUploadPicture}
                    disabled={uploadingPic}
                    className="btn-primary disabled:opacity-50"
                  >
                    {uploadingPic ? 'Uploading...' : 'Upload Picture'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Update your professional details and profile picture above.</p>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Set Availability</h2>
          <p className="text-gray-600 mb-4">Coming soon: Manage your working hours and availability</p>
          <button className="btn-primary">Set Schedule</button>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
          {bookingsError && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
              {bookingsError}
            </div>
          )}
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Note</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingsLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr className="border-t border-gray-200">
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">
                      <div className="font-semibold">{booking.patient.fullName}</div>
                      <div className="text-sm text-gray-600">{booking.patient.email}</div>
                      {booking.patient.phone && (
                        <div className="text-sm text-gray-600">{booking.patient.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-2">{formatDate(booking.appointmentDate)}</td>
                    <td className="px-4 py-2">{`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`}</td>
                    <td className="px-4 py-2 capitalize">{booking.status}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{booking.statusNote || '—'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="btn-primary px-3 py-1"
                        disabled={booking.status === 'approved'}
                        onClick={() => handleBookingAction(booking.id, 'approved')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-secondary px-3 py-1"
                        disabled={booking.status === 'declined'}
                        onClick={() => handleBookingAction(booking.id, 'declined')}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
