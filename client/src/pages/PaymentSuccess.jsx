export default function PaymentSuccess() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto card text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful</h1>
        <p className="text-gray-700 mb-6">
          Your appointment has been confirmed. Check your email for appointment details.
        </p>
        <a href="/patient/appointments" className="btn-primary">
          View Your Appointments
        </a>
      </div>
    </div>
  );
}
