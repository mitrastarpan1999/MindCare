export default function Footer() {
  return (
    <footer
      className="text-white py-12"
      style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MindCare</h3>
            <p className="opacity-90">
              Connecting patients with experienced mental health professionals.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 opacity-90">
              <li><a href="/" className="hover:opacity-80 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:opacity-80 transition-colors">About</a></li>
              <li><a href="/contact" className="hover:opacity-80 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 opacity-90">
              <li><a href="/psychologists" className="hover:opacity-80 transition-colors">Find Psychologist</a></li>
              <li><a href="#" className="hover:opacity-80 transition-colors">Book Appointment</a></li>
              <li><a href="#" className="hover:opacity-80 transition-colors">Online Consultation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="opacity-90">Email: support@mindcare.com</p>
            <p className="opacity-90">Phone: +91 1234567890</p>
          </div>
        </div>

        <hr className="my-8" style={{ borderColor: 'rgba(255,255,255,0.25)' }} />
        <div className="text-center opacity-80">
          <p>&copy; 2025 MindCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
