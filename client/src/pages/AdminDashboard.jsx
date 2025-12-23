import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientForm, setPatientForm] = useState({ fullName: '', email: '', password: '', city: '' });
  const [psychForm, setPsychForm] = useState({ fullName: '', email: '', password: '', city: '' });
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingPsych, setEditingPsych] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'settings'
  const [patientPhotoFile, setPatientPhotoFile] = useState(null);
  const [psychPhotoFile, setPsychPhotoFile] = useState(null);
  const themePresets = [
    {
      name: 'Calm Sky',
      primaryColor: '#2563eb',
      secondaryColor: '#22d3ee',
      backgroundColor: '#f8fafc',
    },
    {
      name: 'Forest Green',
      primaryColor: '#15803d',
      secondaryColor: '#16a34a',
      backgroundColor: '#f0fdf4',
    },
    {
      name: 'Sunset Glow',
      primaryColor: '#ea580c',
      secondaryColor: '#f97316',
      backgroundColor: '#fff7ed',
    },
    {
      name: 'Royal Purple',
      primaryColor: '#7c3aed',
      secondaryColor: '#a855f7',
      backgroundColor: '#f5f3ff',
    },
    {
      name: 'Soft Rose',
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6',
      backgroundColor: '#fdf2f8',
    },
    {
      name: 'Ocean Blue',
      primaryColor: '#0284c7',
      secondaryColor: '#06b6d4',
      backgroundColor: '#f0f9ff',
    },
    {
      name: 'Mint Fresh',
      primaryColor: '#059669',
      secondaryColor: '#14b8a6',
      backgroundColor: '#f0fdfa',
    },
    {
      name: 'Peach Bliss',
      primaryColor: '#d97706',
      secondaryColor: '#fb923c',
      backgroundColor: '#fffbeb',
    },
    {
      name: 'Lavender Dream',
      primaryColor: '#a855f7',
      secondaryColor: '#d8b4fe',
      backgroundColor: '#faf5ff',
    },
    {
      name: 'Coral Reef',
      primaryColor: '#f43f5e',
      secondaryColor: '#fb7185',
      backgroundColor: '#fff1f2',
    },
    {
      name: 'Teal Serenity',
      primaryColor: '#0d9488',
      secondaryColor: '#2dd4bf',
      backgroundColor: '#f0fffe',
    },
    {
      name: 'Indigo Mystic',
      primaryColor: '#4f46e5',
      secondaryColor: '#818cf8',
      backgroundColor: '#f4f3ff',
    },
  ];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, sRes, settingsRes] = await Promise.all([
        adminAPI.getPatients(),
        adminAPI.getPsychologists(),
        adminAPI.getSettings(),
      ]);
      setPatients(pRes.data || []);
      setPsychologists(sRes.data || []);
      setSettings(settingsRes.data || {});
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePatient = async (id) => {
    if (!confirm('Delete this patient?')) return;
    try {
      await adminAPI.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleDeletePsychologist = async (id) => {
    if (!confirm('Delete this psychologist?')) return;
    try {
      await adminAPI.deletePsychologist(id);
      setPsychologists((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient({ ...patient });
  };

  const handleSavePatient = async () => {
    try {
      await adminAPI.updatePatient(editingPatient.id, editingPatient);
      if (patientPhotoFile) {
        await adminAPI.uploadPatientProfilePicture(editingPatient.id, patientPhotoFile);
      }
      setPatients((prev) =>
        prev.map((p) => (p.id === editingPatient.id ? editingPatient : p))
      );
      setEditingPatient(null);
      setPatientPhotoFile(null);
      alert('Patient updated successfully');
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleEditPsych = (psych) => {
    setEditingPsych({ ...psych });
  };

  const handleSavePsych = async () => {
    try {
      await adminAPI.updatePsychologist(editingPsych.id, editingPsych);
      if (psychPhotoFile) {
        await adminAPI.uploadPsychologistProfilePicture(editingPsych.id, psychPhotoFile);
      }
      setPsychologists((prev) =>
        prev.map((p) => (p.id === editingPsych.id ? editingPsych : p))
      );
      setEditingPsych(null);
      setPsychPhotoFile(null);
      alert('Psychologist updated successfully');
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateSettings(settings);
      alert('Settings updated successfully! Refresh the page to see changes.');
      // Reload to apply new settings
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleApplyPreset = async (preset) => {
    const nextSettings = { ...settings, ...preset };
    setSettings(nextSettings);
    try {
      await adminAPI.updateSettings(nextSettings);
      alert(`Applied "${preset.name}". Refreshing to apply...`);
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to apply preset');
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPatient(patientForm);
      setPatientForm({ fullName: '', email: '', password: '', city: '' });
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleCreatePsychologist = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPsychologist({ ...psychForm, city: psychForm.city });
      setPsychForm({ fullName: '', email: '', password: '', city: '' });
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add psychologist');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">{user?.email}</div>
          <button className="text-gray-600 underline text-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Site Settings
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* User Management Tab */}
      {!loading && activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Patients</h2>
            <form onSubmit={handleCreatePatient} className="mb-4 p-4 border rounded bg-white space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input-field"
                  placeholder="Full name"
                  value={patientForm.fullName}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Email"
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Password"
                  type="password"
                  value={patientForm.password}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  placeholder="City"
                  value={patientForm.city}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary px-4 py-2 rounded-md font-semibold">
                  Add Patient
                </button>
              </div>
            </form>
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">City</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">{p.fullName}</td>
                      <td className="p-2">{p.email}</td>
                      <td className="p-2">{p.city || '-'}</td>
                      <td className="p-2 text-center space-x-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEditPatient(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeletePatient(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Psychologists</h2>
            <form onSubmit={handleCreatePsychologist} className="mb-4 p-4 border rounded bg-white space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input-field"
                  placeholder="Full name"
                  value={psychForm.fullName}
                  onChange={(e) => setPsychForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Email"
                  type="email"
                  value={psychForm.email}
                  onChange={(e) => setPsychForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Password"
                  type="password"
                  value={psychForm.password}
                  onChange={(e) => setPsychForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  placeholder="City"
                  value={psychForm.city}
                  onChange={(e) => setPsychForm((prev) => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary px-4 py-2 rounded-md font-semibold">
                  Add Psychologist
                </button>
              </div>
            </form>
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">License</th>
                    <th className="p-2 text-left">Fee</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {psychologists.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-2">{s.fullName}</td>
                      <td className="p-2">{s.email}</td>
                      <td className="p-2">{s.licenseNumber}</td>
                      <td className="p-2">₹{s.consultationFee}</td>
                      <td className="p-2 text-center space-x-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEditPsych(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeletePsychologist(s.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Site Settings Tab */}
      {!loading && activeTab === 'settings' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Website Customization</h2>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Quick Themes</p>
            <div className="flex flex-wrap gap-2">
              {themePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-2 rounded border text-sm"
                  style={{
                    borderColor: preset.primaryColor,
                    color: preset.primaryColor,
                    background: preset.backgroundColor,
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleUpdateSettings} className="space-y-4 bg-white border rounded p-6">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <input
                type="color"
                value={settings.primaryColor || '#3b82f6'}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="w-20 h-10 border rounded cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Main brand color for buttons and accents</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <input
                type="color"
                value={settings.secondaryColor || '#10b981'}
                onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                className="w-20 h-10 border rounded cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Used for secondary buttons and highlights</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <input
                type="color"
                value={settings.backgroundColor || '#f9fafb'}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                className="w-20 h-10 border rounded cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Page background color</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Site Title</label>
              <input
                type="text"
                value={settings.siteTitle || 'Mental Health Platform'}
                onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Mental Health Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Site Description</label>
              <textarea
                value={settings.siteDescription || 'Connect with professional psychologists'}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="3"
                placeholder="Brief description of your platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || 'support@mentalhealth.com'}
                onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="tel"
                value={settings.contactPhone || '+1-555-0100'}
                onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="+1-555-0100"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patient Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Patient</h2>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="text-center">
                  {patientPhotoFile && (
                    <img
                      src={URL.createObjectURL(patientPhotoFile)}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg mx-auto mb-2"
                    />
                  )}
                  {!patientPhotoFile && editingPatient.profilePicture && (
                    <img
                      src={editingPatient.profilePicture}
                      alt="Current"
                      className="h-32 w-32 object-cover rounded-lg mx-auto mb-2"
                    />
                  )}
                  {!patientPhotoFile && !editingPatient.profilePicture && (
                    <div className="h-32 w-32 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-500">No Photo</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPatientPhotoFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  className="input-field"
                  value={editingPatient.fullName}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={editingPatient.email}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  className="input-field"
                  type="number"
                  value={editingPatient.age || ''}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, age: parseInt(e.target.value) }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="input-field"
                  value={editingPatient.gender || ''}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="input-field"
                  value={editingPatient.phone || ''}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  className="input-field"
                  value={editingPatient.city || ''}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  className="input-field"
                  value={editingPatient.state || ''}
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, state: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password (leave blank to keep current)</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="New password"
                  onChange={(e) =>
                    setEditingPatient((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => {
                  setEditingPatient(null);
                  setPatientPhotoFile(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-4 py-2 rounded-md"
                onClick={handleSavePatient}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Psychologist Edit Modal */}
      {editingPsych && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Psychologist</h2>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="text-center">
                  {psychPhotoFile && (
                    <img
                      src={URL.createObjectURL(psychPhotoFile)}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg mx-auto mb-2"
                    />
                  )}
                  {!psychPhotoFile && editingPsych.profilePicture && (
                    <img
                      src={editingPsych.profilePicture}
                      alt="Current"
                      className="h-32 w-32 object-cover rounded-lg mx-auto mb-2"
                    />
                  )}
                  {!psychPhotoFile && !editingPsych.profilePicture && (
                    <div className="h-32 w-32 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-500">No Photo</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPsychPhotoFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  className="input-field"
                  value={editingPsych.fullName}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={editingPsych.email}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="input-field"
                  value={editingPsych.phone || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="input-field"
                  value={editingPsych.gender || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input
                  className="input-field"
                  value={editingPsych.specialization || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, specialization: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input
                  className="input-field"
                  value={editingPsych.licenseNumber || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, licenseNumber: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <input
                  className="input-field"
                  type="number"
                  value={editingPsych.yearsExperience || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, yearsExperience: parseInt(e.target.value) }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Fee (₹)</label>
                <input
                  className="input-field"
                  type="number"
                  value={editingPsych.consultationFee || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, consultationFee: parseFloat(e.target.value) }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clinic Address</label>
                <textarea
                  className="input-field"
                  value={editingPsych.clinicAddress || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, clinicAddress: e.target.value }))
                  }
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qualifications</label>
                <textarea
                  className="input-field"
                  value={editingPsych.qualifications || ''}
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, qualifications: e.target.value }))
                  }
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password (leave blank to keep current)</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="New password"
                  onChange={(e) =>
                    setEditingPsych((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => {
                  setEditingPsych(null);
                  setPsychPhotoFile(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-4 py-2 rounded-md"
                onClick={handleSavePsych}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
