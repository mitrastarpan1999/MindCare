import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { psychologistAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        setLoading(true);
        const response = await psychologistAPI.getMyBookings(user?.id);
        
        // Filter appointments for the specific patient
        const patientAppointments = (response.data.data || response.data).filter(
          (apt) => apt.patientId === parseInt(patientId)
        );

        if (patientAppointments.length > 0) {
          setPatientInfo(patientAppointments[0].patient);
          setAppointments(patientAppointments);
        } else {
          setError("No consultation history found for this patient.");
        }
      } catch (err) {
        setError("Failed to load patient history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, [patientId, user?.id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      confirmed: { bg: "bg-green-100", text: "text-green-700", label: "Confirmed" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      completed: { bg: "bg-blue-100", text: "text-blue-700", label: "Completed" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return statusInfo;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString || "Not specified";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-amber-900 font-semibold">
              Loading consultation history...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate("/patients")}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Patients
          </button>
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/patients")}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 font-semibold transition-colors hover:gap-3"
        >
          <ArrowLeft size={20} />
          Back to Patients
        </button>

        {/* Patient Info Header */}
        {patientInfo && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-amber-100">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                <img
                  src={`https://i.pravatar.cc/200?u=${encodeURIComponent(
                    patientInfo.email || patientInfo.fullName
                  )}`}
                  alt={patientInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-amber-900 mb-2">
                  {patientInfo.fullName}
                </h1>
                <p className="text-amber-700 text-sm mb-3">{patientInfo.email}</p>
                <div className="flex gap-6 text-sm text-gray-600">
                  {patientInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-600" />
                      {patientInfo.phone}
                    </div>
                  )}
                  {patientInfo.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-amber-600" />
                      {patientInfo.city}, {patientInfo.state}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consultation History */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Consultation History ({appointments.length})
          </h2>

          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-amber-100">
              <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4 opacity-50" />
              <p className="text-amber-900 text-lg font-semibold">
                No consultations yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const statusInfo = getStatusBadge(appointment.status);
                return (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-amber-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <Calendar className="text-amber-600" size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="text-lg font-semibold text-amber-900">
                              {formatTime(appointment.appointmentTime)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-gray-600 font-medium">Consultation Type</p>
                          <p className="text-amber-900 font-semibold">
                            {appointment.consultationType || "Not specified"}
                          </p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-gray-600 font-medium">Duration</p>
                          <p className="text-amber-900 font-semibold">
                            {appointment.duration || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 font-medium mb-2">
                            Consultation Notes
                          </p>
                          <p className="text-amber-900">{appointment.notes}</p>
                        </div>
                      )}

                      {appointment.status === "completed" && (
                        <div className="flex items-center gap-2 mt-4 text-green-700 text-sm font-semibold">
                          <CheckCircle size={18} />
                          Session Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
