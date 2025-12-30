import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

export default function Contact() {
  const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || '';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trimmedId = FORMSPREE_ID.trim();
      if (trimmedId) {
        const endpoint = `https://formspree.io/f/${trimmedId}`;
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('message', formData.message);

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        const json = await resp.json();
        if (!resp.ok) {
          throw new Error(json?.errors?.[0]?.message || 'Form submission failed');
        }
      } else {
        const { data } = await publicAPI.sendContact(formData);
        console.log('Contact sent:', data);
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error('Contact send failed:', err);
      alert(err?.message || err?.response?.data?.message || 'Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100">
      <section className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-amber-900">Contact Us</h1>
            <p className="mt-3 text-amber-800/80">
              We’re here to help—reach out and we’ll respond promptly.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info */}
            <div className="card">
              <h2 className="text-2xl font-bold text-amber-900">Get in Touch</h2>
              <div className="mt-4 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-bold text-amber-900">Email</h3>
                    <p className="text-amber-700/80">support@mindcare.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">☎️</div>
                  <div>
                    <h3 className="font-bold text-amber-900">Phone</h3>
                    <p className="text-amber-700/80">+91 1234567890</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-bold text-amber-900">Address</h3>
                    <p className="text-amber-700/80">
                      MindCare Headquarters<br />
                      123 Health Street<br />
                      New Delhi, India 110001
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h3 className="font-bold text-amber-900">Hours</h3>
                    <p className="text-amber-700/80">
                      Mon–Fri: 9:00 AM – 6:00 PM<br />
                      Sat: 10:00 AM – 4:00 PM
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/psychologists" className="btn-primary">Talk to an Expert</Link>
                  <Link to="/about" className="btn-secondary">Learn More</Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitted && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded">
                    Thank you! We’ve received your message and will reply soon.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-amber-900">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-amber-900">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="you@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-amber-900">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="How can we help?"
                    rows="6"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 max-w-3xl mx-auto text-center card">
            <h3 className="text-2xl font-bold text-amber-900">Prefer a quick call?</h3>
            <p className="mt-2 text-amber-700/80">Our team is ready to help you get started.</p>
            <div className="mt-4 flex justify-center gap-3">
              <a href="tel:+911234567890" className="btn-primary">Call Support</a>
              <Link to="/psychologists" className="btn-secondary">Talk to an Expert</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
