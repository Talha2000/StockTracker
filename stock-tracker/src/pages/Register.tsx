import { isAxiosError } from 'axios';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Spinner } from '@/components/Spinner';
import { authApi } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_HINT =
  'At least 8 characters with an uppercase letter, a lowercase letter, a digit and one of @ $ ! % * ? &';

export const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(inputs.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!PASSWORD_RE.test(inputs.password)) {
      setError(`Password requirements: ${PASSWORD_HINT}`);
      return;
    }

    setLoading(true);
    try {
      await authApi.register(inputs);
      void navigate('/login');
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 409
          ? 'That user already exists'
          : 'Error registering user',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        noValidate
        className="flex w-full max-w-md flex-col rounded-lg bg-black p-10 text-white shadow-2xl dark:bg-gray-800"
      >
        <h1 className="pb-8 text-3xl font-bold">Sign up</h1>

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

        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field mb-6"
          value={inputs.email}
          onChange={handleChange}
        />

        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-describedby="password-hint"
          className="field mb-2"
          value={inputs.password}
          onChange={handleChange}
        />
        <p id="password-hint" className="mb-6 text-xs text-gray-300">
          {PASSWORD_HINT}
        </p>

        {loading ? (
          <Spinner label="Creating account" />
        ) : (
          <button
            type="submit"
            className="mb-3 w-full rounded-lg bg-sky-600 px-5 py-2.5 text-lg font-medium hover:bg-cyan-700 focus:ring-4 focus:outline-none"
          >
            Create account
          </button>
        )}

        {error && (
          <p role="alert" className="text-center text-red-400">
            {error}
          </p>
        )}
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-300 underline">
            Log in
          </Link>
        </span>
      </form>
    </div>
  );
};
