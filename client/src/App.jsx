import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PsychologistList from './pages/PsychologistList';
import PatientList from './pages/PatientList';
import PatientHistory from './pages/PatientHistory';
import PsychologistDetails from './pages/PsychologistDetails';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointments from './pages/PatientAppointments';
import PsychologistDashboard from './pages/PsychologistDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/psychologists" element={<PsychologistList />} />
              <Route path="/psychologist/:id" element={<PsychologistDetails />} />
              
              {/* Patients List - for Psychologists to see their patients */}
              <Route
                path="/patients"
                element={
                  <ProtectedRoute requiredRole="psychologist">
                    <PatientList />
                  </ProtectedRoute>
                }
              />
              
              {/* Patient History - for Psychologists to view patient consultation history */}
              <Route
                path="/patient/:patientId/history"
                element={
                  <ProtectedRoute requiredRole="psychologist">
                    <PatientHistory />
                  </ProtectedRoute>
                }
              />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientAppointments />
                  </ProtectedRoute>
                }
              />

              {/* Psychologist Routes */}
              <Route
                path="/psychologist/dashboard"
                element={
                  <ProtectedRoute requiredRole="psychologist">
                    <PsychologistDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Payment Routes */}
              <Route path="/payment/success" element={<PaymentSuccess />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}
