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
    <div className="container-custom px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Psychologist Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.fullName}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
        <div className="card p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-600 uppercase tracking-wide">Total</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">0</p>
          <p className="text-xs text-gray-500 mt-1">Appointments</p>
        </div>
        <div className="card p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-600 uppercase tracking-wide">Pending</h3>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">0</p>
          <p className="text-xs text-gray-500 mt-1">Bookings</p>
        </div>
        <div className="card p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-600 uppercase tracking-wide">Completed</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">0</p>
          <p className="text-xs text-gray-500 mt-1">Sessions</p>
        </div>
        <div className="card p-4 sm:p-6 col-span-2 lg:col-span-1">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-600 uppercase tracking-wide">Earnings</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">₹0</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
        {['overview', 'profile', 'availability', 'bookings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 sm:px-4 font-semibold border-b-2 whitespace-nowrap text-sm sm:text-base ${
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
        <div className="space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Dashboard Overview</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Welcome to your psychologist dashboard. Here you can manage your profile, set availability,
              and view your appointments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Total Consultations</p>
                <p className="text-base sm:text-lg font-bold text-blue-700">0 of 0 hours this month</p>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-green-900 mb-1">Next Appointment</p>
                <p className="text-base sm:text-lg font-bold text-green-700">No upcoming appointments</p>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-purple-900 mb-1">Profile Status</p>
                <p className="text-base sm:text-lg font-bold text-purple-700">Active</p>
              </div>
              <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-orange-900 mb-1">Response Rate</p>
                <p className="text-base sm:text-lg font-bold text-orange-700">100%</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveTab('profile')}
                className="btn-primary py-3 text-sm sm:text-base"
              >
                Update Profile
              </button>
              <button 
                onClick={() => setActiveTab('availability')}
                className="btn-secondary py-3 text-sm sm:text-base"
              >
                Set Availability
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className="btn-outline py-3 text-sm sm:text-base"
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Profile</h2>
          {profileError && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
              {profileError}
            </div>
          )}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={previewUrl || resolveImage(user?.profilePicture, user?.fullName)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2 text-sm w-full"
                />
                {profileFile && (
                  <button
                    type="button"
                    onClick={handleUploadPicture}
                    disabled={uploadingPic}
                    className="btn-primary disabled:opacity-50 w-full sm:w-auto text-sm"
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
        <div className="card p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Set Availability</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Coming soon: Manage your working hours and availability</p>
          <button className="btn-primary w-full sm:w-auto">Set Schedule</button>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="card p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Bookings</h2>
            {bookingsError && (
              <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                {bookingsError}
              </div>
            )}
            
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
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
            
            {/* Mobile Card View - Visible only on mobile */}
            <div className="md:hidden space-y-3">
              {bookingsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No bookings found
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-base">{booking.patient.fullName}</h3>
                        <p className="text-xs text-gray-600">{booking.patient.email}</p>
                        {booking.patient.phone && (
                          <p className="text-xs text-gray-600">{booking.patient.phone}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'declined' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(booking.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`}</span>
                      </div>
                      {booking.statusNote && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="text-sm text-gray-700">{booking.statusNote}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        className="btn-primary flex-1 py-2 text-sm"
                        disabled={booking.status === 'approved'}
                        onClick={() => handleBookingAction(booking.id, 'approved')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-secondary flex-1 py-2 text-sm"
                        disabled={booking.status === 'declined'}
                        onClick={() => handleBookingAction(booking.id, 'declined')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
