import React from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();
  const slugName = patient.fullName
    ? patient.fullName.toLowerCase().replace(/\s+/g, "_")
    : "profile";
  const localImage = `/images/${slugName}.jpg`;
  const aiAvatar = `https://i.pravatar.cc/400?u=${encodeURIComponent(
    patient.email || patient.fullName || slugName
  )}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100">
      {/* Profile Image */}
      <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
        <img
          src={patient.profilePicture || localImage || aiAvatar}
          alt={patient.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const currentSrc = e.target.src || "";
            if (!currentSrc.includes(localImage) && !currentSrc.includes('i.pravatar.cc')) {
              e.target.src = localImage;
            } else if (!currentSrc.includes('i.pravatar.cc')) {
              e.target.src = aiAvatar;
            } else {
              e.target.src = `https://ui-avatars.com/api/?name=${patient.fullName}&background=random`;
            }
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name */}
        <h3 className="text-xl font-bold text-amber-900 mb-1">
          {patient.fullName}
        </h3>
        <p className="text-amber-700 font-medium text-sm mb-3">
          Patient
        </p>

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          {/* Email */}
          <div className="flex items-center gap-2 text-amber-900 opacity-70 text-sm">
            <Mail className="w-4 h-4 text-amber-600" />
            <span className="truncate">{patient.email || "Not provided"}</span>
          </div>

          {/* Phone */}
          {patient.phone && (
            <div className="flex items-center gap-2 text-amber-900 opacity-70 text-sm">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>{patient.phone}</span>
            </div>
          )}

          {/* Location */}
          {patient.city && (
            <div className="flex items-center gap-2 text-amber-900 opacity-70 text-sm">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="truncate">{patient.city}, {patient.state}</span>
            </div>
          )}

          {/* Age */}
          {patient.age && (
            <div className="flex items-center gap-2 text-amber-900 opacity-70 text-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{patient.age} years old</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-amber-100">
          <button
            onClick={() => navigate(`/patient/${patient.id}/history`)}
            className="w-full bg-gradient-to-r from-amber-700 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-800 hover:to-orange-700 transition-all duration-300 hover:shadow-lg"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
