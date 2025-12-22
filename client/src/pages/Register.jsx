import { useState } from 'react';
import RegisterPatientForm from '../components/RegisterPatientForm';
import RegisterPsychologistForm from '../components/RegisterPsychologistForm';

export default function Register() {
  const [userType, setUserType] = useState('patient');

  return (
    <div className="container-custom py-16" style={{ backgroundColor: 'var(--background-color)' }}>
      <h1 className="text-5xl font-bold text-center mb-12" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Register</h1>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setUserType('patient')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              userType === 'patient'
                ? 'text-white shadow-lg'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            style={userType === 'patient' ? { background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' } : {}}
          >
            Register as Patient
          </button>
          <button
            onClick={() => setUserType('psychologist')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              userType === 'psychologist'
                ? 'text-white shadow-lg'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            style={userType === 'psychologist' ? { background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' } : {}}
          >
            Register as Psychologist
          </button>
        </div>

        {userType === 'patient' ? (
          <RegisterPatientForm />
        ) : (
          <RegisterPsychologistForm />
        )}

        <p className="text-center mt-8" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
          Already have an account?{' '}
          <a href="/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--primary-color)' }}>
            Login here
          </a>
        </p>
          <p className="text-center mt-3" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            Forgot password?{' '}
            <a href="/forgot-password" className="font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--primary-color)' }}>
              Reset it here
            </a>
          </p>
      </div>
    </div>
  );
}
