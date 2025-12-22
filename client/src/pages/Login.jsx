import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <LoginForm />
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
