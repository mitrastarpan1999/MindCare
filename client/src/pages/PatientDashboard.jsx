import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);

  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/?api$/, '');
  const resolveImage = (pic, fallbackName = 'User') => {
    if (!pic) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`;
    if (pic.startsWith('http')) return pic;
    if (pic.startsWith('/')) return `${apiBase}${pic}`;
    return pic;
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
    try {
      await profileAPI.uploadPatientProfilePicture(profileFile);
      setPreviewUrl(null);
      setProfileFile(null);
      // Reload page to refresh profile picture
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload picture');
    } finally {
      setUploadingPic(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await profileAPI.updatePatientProfile(profile);
      setProfile(response.data.patient);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Patient Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.fullName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
        <div className="card p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-600">Welcome</h3>
          <p className="text-base sm:text-lg font-bold text-gray-900">{user?.fullName}</p>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
        </div>

        <div className="card p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-600">Profile</h3>
          <p className="text-sm text-gray-700 mb-2 sm:mb-3">Manage your profile and preferences</p>
          <button onClick={() => setEditing(!editing)} className="btn-primary text-sm sm:text-base w-full sm:w-auto">
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-600">Appointments</h3>
          <p className="text-sm text-gray-700 mb-2 sm:mb-3">View your bookings and history</p>
          <a href="/patient/appointments" className="btn-primary inline-block text-sm sm:text-base w-full sm:w-auto text-center">
            View Appointments
          </a>
        </div>
      </div>

      {editing && (
        <div className="card max-w-2xl mb-8 sm:mb-12 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Profile</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 rounded mb-4 text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                      className="btn-primary disabled:opacity-50 text-sm w-full sm:w-auto"
                    >
                      {uploadingPic ? 'Uploading...' : 'Upload Picture'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      age: parseInt(e.target.value) || '',
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={profile.gender || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={profile.state || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      <div className="card p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Next Steps</h2>
        <ol className="space-y-2 text-sm sm:text-base text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary flex-shrink-0">1.</span>
            <span>Browse psychologists in our directory</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary flex-shrink-0">2.</span>
            <span>Check their qualifications, experience, and availability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary flex-shrink-0">3.</span>
            <span>Book an appointment at your preferred time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary flex-shrink-0">4.</span>
            <span>Complete the payment to confirm the booking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary flex-shrink-0">5.</span>
            <span>Receive consultation confirmation via email</span>
          </li>
        </ol>
        <a href="/psychologists" className="btn-primary inline-block mt-4 w-full sm:w-auto text-center text-sm sm:text-base">
          Browse Psychologists
        </a>
      </div>
    </div>
  );
}
