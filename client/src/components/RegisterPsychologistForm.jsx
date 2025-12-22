import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validatePhone } from '../utils/helpers';

export default function RegisterPsychologistForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    clinicAddress: '',
    qualifications: '',
    licenseNumber: '',
    yearsExperience: '',
    consultationFee: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.licenseNumber ||
      !formData.consultationFee
    ) {
      setError('All required fields must be filled');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      if (formData.phone) payload.append('phone', formData.phone);
      if (formData.gender) payload.append('gender', formData.gender);
      if (formData.clinicAddress) payload.append('clinicAddress', formData.clinicAddress);
      if (formData.qualifications) payload.append('qualifications', formData.qualifications);
      if (formData.licenseNumber) payload.append('licenseNumber', formData.licenseNumber);
      if (formData.yearsExperience) payload.append('yearsExperience', parseInt(formData.yearsExperience));
      if (formData.consultationFee) payload.append('consultationFee', parseFloat(formData.consultationFee));
      if (profileFile) payload.append('profilePicture', profileFile);

      const response = await authAPI.registerPsychologistWithFile(payload);

      login(response.data.token, response.data.user);
      navigate('/psychologist/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-5">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>License Number *</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your license number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Consultation Fee (₹) *</label>
          <input
            type="number"
            step="0.01"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter consultation fee"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Qualifications</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., M.D. (Psychiatry), B.A. (Psychology)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Years of Experience</label>
          <input
            type="number"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter years of experience"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Clinic Address</label>
          <textarea
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your clinic address"
            rows="2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Profile Photo</label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleFileChange} className="px-4 py-2 rounded-lg border" style={{ borderColor: 'rgba(0,0,0,0.1)' }} />
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="w-16 h-16 rounded-full object-cover shadow-md" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter password (min 6 chars)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
            placeholder="Confirm password"
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all"
          style={{ minWidth: '220px' }}
        >
          {loading ? 'Registering...' : 'Register as Psychologist'}
        </button>
      </div>
    </form>
  );
}
