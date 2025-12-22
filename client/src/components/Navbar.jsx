import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = "transition-all duration-300 font-medium text-sm relative group";
  const navLinkUnderline = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 group-hover:after:w-full";

  return (
    <nav
      className="sticky top-0 z-50 shadow-md border-b"
      style={{
        backgroundColor: 'var(--background-color)',
        borderColor: 'rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold hover:scale-105 transition-transform"
            style={{ color: 'var(--primary-color)' }}
          >
            MindCare
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`${navLinkClass} ${navLinkUnderline}`} style={{ color: 'var(--text-dark, #2d2d2d)' }}>
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'patient' && (
                  <Link to="/psychologists" className={`${navLinkClass} ${navLinkUnderline}`} style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                    Psychologists
                  </Link>
                )}
                {user?.role === 'psychologist' && (
                  <Link to="/patients" className={`${navLinkClass} ${navLinkUnderline}`} style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                    Patients
                  </Link>
                )}
              </>
            ) : (
              <Link to="/psychologists" className={`${navLinkClass} ${navLinkUnderline}`} style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                Psychologists
              </Link>
            )}
            
            <Link to="/about" className={`${navLinkClass} ${navLinkUnderline}`} style={{ color: 'var(--text-dark, #2d2d2d)' }}>
              About
            </Link>
            <Link to="/contact" className={`${navLinkClass} ${navLinkUnderline}`} style={{ color: 'var(--text-dark, #2d2d2d)' }}>
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg border" style={{ backgroundColor: 'var(--background-color)', borderColor: 'rgba(0,0,0,0.06)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{user?.fullName}</span>
                </div>
                {user?.role === 'patient' && (
                  <Link to="/patient/dashboard" className="px-4 py-2 rounded-lg transition-all font-medium text-sm" style={{ color: 'var(--primary-color)' }}>
                    Dashboard
                  </Link>
                )}
                {user?.role === 'psychologist' && (
                  <Link to="/psychologist/dashboard" className="px-4 py-2 rounded-lg transition-all font-medium text-sm" style={{ color: 'var(--primary-color)' }}>
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg transition-all duration-300 font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 font-semibold text-sm rounded-lg transition-all duration-300"
                  style={{ color: 'var(--primary-color)' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-5 py-2 rounded-lg transition-all duration-300 font-semibold text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden mt-6 pb-6 space-y-4 border-t pt-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <Link to="/" className="block font-medium" style={{ color: 'var(--text-dark, #2d2d2d)' }} onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'patient' && (
                  <Link to="/psychologists" className="block font-medium" style={{ color: 'var(--text-dark, #2d2d2d)' }} onClick={() => setMobileOpen(false)}>
                    Psychologists
                  </Link>
                )}
                {user?.role === 'psychologist' && (
                  <Link to="/patients" className="block font-medium" style={{ color: 'var(--text-dark, #2d2d2d)' }} onClick={() => setMobileOpen(false)}>
                    Patients
                  </Link>
                )}
              </>
            ) : (
              <Link to="/psychologists" className="block font-medium" style={{ color: 'var(--text-dark, #2d2d2d)' }} onClick={() => setMobileOpen(false)}>
                Psychologists
              </Link>
            )}
            
            <Link to="/about" className="block font-medium" style={{ color: 'var(--text-dark, #2d2d2d)' }} onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block font-medium" style={{ color: 'var(--text-dark, #2d2d2d)' }} onClick={() => setMobileOpen(false)}>
              Contact
            </Link>

            <div className="pt-4 border-t space-y-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 rounded-lg border mb-2" style={{ backgroundColor: 'var(--background-color)', borderColor: 'rgba(0,0,0,0.06)' }}>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{user?.fullName}</span>
                  </div>
                  {user?.role === 'patient' && (
                    <Link to="/patient/dashboard" className="block px-4 py-2 rounded-lg font-medium" style={{ color: 'var(--primary-color)' }} onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  {user?.role === 'psychologist' && (
                    <Link to="/psychologist/dashboard" className="block px-4 py-2 rounded-lg font-medium" style={{ color: 'var(--primary-color)' }} onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg transition-colors font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                      color: '#fff',
                      border: 'none',
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 rounded-lg font-semibold"
                    style={{ color: 'var(--primary-color)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 btn-primary text-white rounded-lg font-semibold text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
