import { isAxiosError } from 'axios';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';

const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;

export const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setError(null);

    if (inputs.username.trim().length < MIN_USERNAME_LENGTH) {
      setError(`Username must be at least ${MIN_USERNAME_LENGTH} characters`);
      return;
    }
    if (inputs.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (inputs.password !== inputs.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ username: inputs.username, password: inputs.password });
      void navigate('/login');
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 409
          ? 'That username is taken. Try another one.'
          : 'Couldn’t create your account. Try again in a moment.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-4xl font-extrabold tracking-tight">Sign up</h1>

      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        noValidate
        className="mt-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={inputs.username}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            aria-describedby="password-hint"
            required
            value={inputs.password}
            onChange={handleChange}
          />
          <p id="password-hint" className="text-sm text-muted">
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={inputs.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-field bg-down-soft px-4 py-3 text-sm font-medium text-down"
          >
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
