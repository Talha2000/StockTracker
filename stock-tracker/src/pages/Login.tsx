import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/context/auth';

export const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(inputs);
    setLoading(false);
    if (result.ok) void navigate('/META');
    else setError(result.error);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="flex w-full max-w-md flex-col rounded-lg bg-black p-10 text-white shadow-2xl dark:bg-gray-800"
      >
        <h1 className="pb-8 text-3xl font-bold">Sign in to your account</h1>

        <label htmlFor="username" className="mb-2 block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="field mb-6"
          value={inputs.username}
          onChange={handleChange}
        />

        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field mb-6"
          value={inputs.password}
          onChange={handleChange}
        />

        {loading ? (
          <Spinner label="Signing in" />
        ) : (
          <button
            type="submit"
            className="mb-3 w-full rounded-lg bg-sky-600 px-5 py-2.5 text-lg font-medium hover:bg-cyan-700 focus:ring-4 focus:outline-none"
          >
            Sign in
          </button>
        )}

        {error && (
          <p role="alert" className="text-center text-red-400">
            {error}
          </p>
        )}
        <span>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-cyan-300 underline">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
};
