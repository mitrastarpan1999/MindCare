import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Heart, Brain, Users, Shield, Stethoscope, MessageCircle, TrendingUp, Award, ArrowRight, CheckCircle } from 'lucide-react';
import ExpertCarousel from '../components/ExpertCarousel';
// AI Video Gallery removed as per request

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out;
  }

  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .btn-hover {
    transition: all 0.3s ease;
  }

  .btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

export default function Home() {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      icon: Heart,
      title: "Adult Therapy",
      desc: "Talk to trained therapists who help you make sense of things and feel more in control."
    },
    {
      icon: Brain,
      title: "Adult Psychiatry",
      desc: "Meet psychiatrists who help with sleep, focus, energy, mood and find the right treatment."
    },
    {
      icon: Users,
      title: "Family Support",
      desc: "Expert support for families to navigate challenges together and strengthen connections."
    },
    {
      icon: MessageCircle,
      title: "Community",
      desc: "Join a safe, supportive space where people share experiences and support each other."
    }
  ];

  const conditions = [
    { name: "Depression", desc: "Persistent sadness and loss of interest in activities" },
    { name: "Anxiety", desc: "Excessive worry and fear affecting daily life" },
    { name: "Stress Management", desc: "Coping strategies for work and life stress" },
    { name: "Relationship Issues", desc: "Support for couples and individual relationship concerns" },
    { name: "Sleep Disorders", desc: "Professional help for insomnia and sleep problems" },
    { name: "ADHD", desc: "Focus, organization and attention support" },
    { name: "OCD", desc: "Managing obsessive thoughts and compulsive behaviors" },
    { name: "Trauma & PTSD", desc: "Healing from past traumatic experiences" },
  ];

  const stats = [
    { number: "90%", label: "Clients say therapist helped understand thoughts in first session" },
    { number: "93%", label: "Notice better sleep & focus within 3-4 sessions" },
    { number: "2x", label: "Better outcomes with both therapist & psychiatrist" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      <style>{styles}</style>
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--background-color) 0%, rgba(255,255,255,0.5) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 50%, var(--primary-color), transparent 50%), radial-gradient(circle at 80% 80%, var(--secondary-color), transparent 50%)' }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                A mental healthcare <br /> <span className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">ecosystem that works for you</span>
              </h1>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto mb-10" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                We follow the bio-psycho-social model because your body, mind, and environment all shape how you feel. Our care supports every part of your life, not just symptoms.
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="btn-primary btn-hover inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold shadow-lg"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/psychologists"
                    className="btn-hover inline-flex items-center justify-center gap-2 border-2 px-8 py-4 rounded-xl font-semibold"
                    style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', backgroundColor: 'rgba(0,0,0,0.02)' }}
                  >
                    Find a Professional
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <Link
                  to="/psychologists"
                  className="btn-primary btn-hover inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold shadow-lg"
                >
                  Browse Professionals <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Video Gallery removed */}

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in-up p-8 rounded-2xl hover:shadow-lg transition-all" style={{ animationDelay: `${i * 0.1}s`, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <div className="text-6xl font-bold mb-3" style={{ color: 'var(--primary-color)' }}>{stat.number}</div>
                <p className="opacity-75 text-lg leading-relaxed" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, white, var(--background-color))' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4 animate-fade-in-up" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Our Services</h2>
            <p className="text-xl opacity-75 animate-fade-in-up" style={{ color: 'var(--text-dark, #2d2d2d)', animationDelay: '0.1s' }}>Expert care tailored to your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div 
                key={i} 
                className="p-8 rounded-2xl card-hover border transition-all animate-fade-in-up" 
                style={{ 
                  backgroundColor: 'var(--background-color)', 
                  borderColor: 'rgba(0,0,0,0.1)',
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                  <service.icon className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{service.title}</h3>
                <p className="opacity-70 text-base leading-relaxed" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Team Carousel */}
      <ExpertCarousel />

      {/* Conditions We Treat */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4 animate-fade-in-up" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Conditions We Support</h2>
            <p className="text-xl opacity-75 animate-fade-in-up" style={{ color: 'var(--text-dark, #2d2d2d)', animationDelay: '0.1s' }}>We offer support for 30+ mental health conditions</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conditions.map((condition, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-xl card-hover border animate-fade-in-up" 
                style={{ 
                  borderColor: 'rgba(0,0,0,0.08)',
                  animationDelay: `${(i % 4) * 0.1}s`
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{condition.name}</h3>
                </div>
                <p className="text-sm opacity-70 ml-5" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{condition.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-5xl font-bold mb-8" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Why Choose Our Platform</h2>
              <div className="space-y-6">
                {[
                  { title: "Expert Team", desc: "200+ qualified therapists and psychiatrists" },
                  { title: "Integrated Care", desc: "Therapists and doctors work together" },
                  { title: "Flexible Access", desc: "Online and in-person sessions available" },
                  { title: "Privacy & Security", desc: "HIPAA compliant and fully encrypted" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--primary-color)' }} />
                    <div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{item.title}</h3>
                      <p className="opacity-70" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8 shadow-xl overflow-hidden animate-slide-in-right" style={{ backgroundColor: 'var(--background-color)' }}>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop"
                alt="Professional care"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4 animate-fade-in-up" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Real Stories, Real Progress</h2>
            <p className="text-xl opacity-75 animate-fade-in-up" style={{ color: 'var(--text-dark, #2d2d2d)', animationDelay: '0.1s' }}>Hear from people who found clarity through our platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-2xl border card-hover animate-fade-in-up" 
                style={{ 
                  borderColor: 'rgba(0,0,0,0.08)',
                  animationDelay: `${(i - 1) * 0.1}s`
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&random=${i}`}
                    alt="Patient"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Patient {i}</h4>
                    <p className="text-sm opacity-60" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Therapy Client</p>
                  </div>
                </div>
                <p className="opacity-80 italic mb-6 leading-relaxed" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                  "This platform changed my life. The therapist really understood me and helped me work through issues I've been struggling with for years."
                </p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-lg" style={{ color: 'var(--primary-color)' }}>★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white, transparent 50%), radial-gradient(circle at 70% 30%, white, transparent 50%)' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 animate-fade-in-up">Take the First Step</h2>
          <p className="text-xl mb-10 opacity-95 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Your mental health matters. Connect with a professional who understands and can help you feel better.
          </p>
          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-xl font-semibold btn-hover"
              style={{ color: 'var(--primary-color)' }}
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/psychologists"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all btn-hover"
            >
              Find Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto text-center animate-fade-in-up">
          <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Questions? We're Here to Help</h3>
          <p className="opacity-75 mb-8 text-lg" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Chat with our care team or book a free consultation</p>
          <Link
            to="/contact"
            className="btn-primary btn-hover inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
