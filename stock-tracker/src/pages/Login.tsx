import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth';

export const Login = () => {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
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
    <AuthLayout>
      <h1 className="text-4xl font-extrabold tracking-tight">Sign in to your account</h1>

      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
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
            autoComplete="current-password"
            required
            value={inputs.password}
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
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-muted">
        New here?{' '}
        <Link
          to="/register"
          className="font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};
