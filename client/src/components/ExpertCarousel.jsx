import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Briefcase, Award } from "lucide-react";
import { psychologistAPI } from "../services/api";

const styles = `
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

  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover:hover {
    transform: translateY(-12px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  }

  .btn-nav:hover {
    transform: scale(1.1);
  }
`;

const ExpertCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/?api$/, '');
  
  const resolveImage = (pic, fallbackName = 'Expert') => {
    if (!pic) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`;
    if (pic.startsWith('http')) return pic;
    if (pic.startsWith('/')) return `${apiBase}${pic}`;
    return pic;
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await psychologistAPI.getAllPsychologists();
      const psychologists = response.data.data || [];
      // Take first 6 or all if less than 6
      setExperts(psychologists.slice(0, 6));
    } catch (error) {
      console.error('Failed to load experts:', error);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoPlay || experts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % experts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, experts.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + experts.length) % experts.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % experts.length);
    setAutoPlay(false);
  };

  const visibleExperts = experts.length >= 3 ? [
    experts[currentIndex],
    experts[(currentIndex + 1) % experts.length],
    experts[(currentIndex + 2) % experts.length],
  ] : experts;

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: 'var(--text-dark, #2d2d2d)' }}>Loading our expert team...</p>
        </div>
      </section>
    );
  }

  if (experts.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            Our Expert Team
          </h2>
          <p className="text-xl opacity-75" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            No psychologists available at the moment. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-color)' }}>
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            Our Expert Team
          </h2>
          <p className="text-xl opacity-75 max-w-2xl mx-auto" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            {experts.length}+ qualified therapists and psychiatrists dedicated to your mental wellness
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {visibleExperts.map((expert, idx) => (
              <div
                key={expert.id}
                className="bg-white rounded-2xl card-hover overflow-hidden border"
                style={{ 
                  borderColor: 'rgba(0,0,0,0.08)',
                  animation: `slideIn${idx % 2 === 0 ? 'Left' : 'Right'} 0.5s ease-out`,
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                {/* Expert Image */}
                <div className="relative h-80 overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
                  <img
                    src={resolveImage(expert.profilePicture, expert.fullName)}
                    alt={expert.fullName}
                    className="w-full h-full object-cover"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 flex items-center gap-1 shadow-lg backdrop-blur-md bg-opacity-90">
                    <Star className="w-5 h-5" style={{ color: 'var(--secondary-color)' }} fill="currentColor" />
                    <span className="font-bold text-sm" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                      {expert.rating?.toFixed(1) || '5.0'}
                    </span>
                  </div>
                  {/* Experience Badge */}
                  {expert.yearsExperience && (
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg px-3 py-2 backdrop-blur-md">
                      <p className="text-xs opacity-70" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Experience</p>
                      <p className="font-bold text-lg" style={{ color: 'var(--primary-color)' }}>{expert.yearsExperience}y</p>
                    </div>
                  )}
                </div>

                {/* Expert Info */}
                <div className="p-8">
                  {/* Name and Title */}
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                    {expert.fullName}
                  </h3>
                  <p className="font-semibold text-base mb-4" style={{ color: 'var(--primary-color)' }}>
                    {expert.specialization || 'Mental Health Professional'}
                  </p>

                  {/* Specialization */}
                  {expert.clinicAddress && (
                    <div className="flex items-center gap-3 mb-4 text-sm">
                      <Briefcase className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary-color)' }} />
                      <p className="opacity-75" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{expert.clinicAddress}</p>
                    </div>
                  )}

                  {/* Credentials */}
                  {expert.qualifications && (
                    <div className="flex items-start gap-3 mb-4 text-sm">
                      <Award className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <p className="opacity-70" style={{ color: 'var(--text-dark, #2d2d2d)' }}>{expert.qualifications}</p>
                    </div>
                  )}

                  {/* Bio */}
                  {expert.about && (
                    <p className="opacity-75 text-sm mb-6 line-clamp-2" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
                      {expert.about}
                    </p>
                  )}

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <div>
                      <p className="text-xs opacity-60 mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>Consultation Fee</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>₹{expert.consultationFee}</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/psychologist/${expert.id}`}
                      className="font-semibold text-base transition-all px-4 py-2 rounded-lg hover:bg-opacity-10"
                      style={{ color: 'var(--primary-color)', backgroundColor: 'rgba(0,0,0,0.02)' }}
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-8 mb-10">
            <button
              onClick={goToPrevious}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="btn-nav p-4 rounded-full text-white transition-all shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="flex gap-3">
              {experts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setAutoPlay(false);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 h-3"
                      : "w-3 h-3"
                  }`}
                  style={{ backgroundColor: idx === currentIndex ? 'var(--primary-color)' : 'rgba(0,0,0,0.15)' }}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="btn-nav p-4 rounded-full text-white transition-all shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center text-sm opacity-70 mb-12" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            Showing {currentIndex + 1}-{Math.min(currentIndex + 3, experts.length)} of {experts.length} experts
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="opacity-75 mb-8 text-lg" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            Find the perfect mental health expert for your needs
          </p>
          <a
            href="/psychologists"
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
          >
            Browse All Experts
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExpertCarousel;
