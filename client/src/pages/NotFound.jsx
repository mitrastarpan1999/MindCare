export default function NotFound() {
  return (
    <div className="container-custom flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</p>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  );
}
