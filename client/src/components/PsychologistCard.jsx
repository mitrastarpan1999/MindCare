import React from "react";
import { Star, MapPin, Briefcase, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PsychologistCard = ({ psychologist }) => {
  const navigate = useNavigate();

  const slugName = psychologist.fullName
    ? psychologist.fullName.toLowerCase().replace(/\s+/g, "_")
    : "profile";
  const localImage = `/images/${slugName}.jpg`;
  const aiAvatar = `https://i.pravatar.cc/400?u=${encodeURIComponent(
    psychologist.email || psychologist.fullName || slugName
  )}`;

  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000')
    .replace(/\/?api$/, '');
  const resolveImage = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http')) return pic;
    if (pic.startsWith('/')) return `${apiBase}${pic}`;
    return pic;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderColor: 'rgba(0,0,0,0.08)', borderWidth: '1px' }}>
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary-color, #2563eb) 0%, var(--secondary-color, #22d3ee) 100%)' }}>
        <img
          src={
            resolveImage(psychologist.profilePicture) || localImage || aiAvatar
          }
          alt={psychologist.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const currentSrc = e.target.src || "";
            if (!currentSrc.includes(localImage) && !currentSrc.includes('i.pravatar.cc')) {
              // try local image next
              e.target.src = localImage;
            } else if (!currentSrc.includes('i.pravatar.cc')) {
              // try AI-generated avatar
              e.target.src = aiAvatar;
            } else {
              // final fallback: UI avatars with initials
              e.target.src = `https://ui-avatars.com/api/?name=${psychologist.fullName}&background=random`;
            }
          }}
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
          <Star className="w-4 h-4 fill-current text-current" style={{ color: 'var(--primary-color)' }} />
          <span className="font-semibold text-sm text-gray-900">{psychologist.rating?.toFixed(1) || "5.0"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Title */}
        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
          {psychologist.fullName}
        </h3>
        <p className="font-medium text-sm mb-3" style={{ color: 'var(--primary-color)' }}>
          {psychologist.specialization || "Mental Health Professional"}
        </p>

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>
            <MapPin className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
            <span className="truncate">{psychologist.clinicAddress || "Not specified"}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>
            <Briefcase className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
            <span>{psychologist.yearsExperience || 0}+ years experience</span>
          </div>

          {/* Session Duration */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>
            <Clock className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
            <span>30 min session</span>
          </div>
        </div>

        {/* About */}
        {psychologist.about && (
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.7 }}>
            {psychologist.about}
          </p>
        )}

        {/* Fee and Button */}
        <div className="flex items-center justify-between pt-4" style={{ borderTopColor: 'rgba(0,0,0,0.08)', borderTopWidth: '1px' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-dark, #2d2d2d)', opacity: 0.6 }}>Consultation Fee</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
              ₹{psychologist.consultationFee}
            </p>
          </div>
          <button
            onClick={() =>
              navigate(`/psychologist/${psychologist.id}`, {
                state: { psychologist },
              })
            }
            className="text-white px-6 py-2 rounded-lg font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsychologistCard;
