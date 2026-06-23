import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getErrorMessage = (error) => {
    return error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/users/register', {
        name,
        email,
        password,
      });

      alert('Registration Successful');
      navigate('/login');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#020617_42%,_#000000_100%)] px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl p-10 rounded-3xl after:absolute after:left-1/2 after:top-1/2 after:-z-10 after:h-64 after:w-64 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-blue-500/20 after:blur-3xl"
      >
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/70">
            Enterprise Fitness
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Start tracking your progress with a smarter fitness dashboard.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold tracking-tight text-white/75">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-3 w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500 focus:ring-0"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold tracking-tight text-white/75">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-3 w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500 focus:ring-0"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold tracking-tight text-white/75">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-3 w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500 focus:ring-0"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold tracking-tight text-white/75">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="mt-3 w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-blue-500 focus:ring-0"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-4 font-bold tracking-tight text-white shadow-lg shadow-blue-950/40 transition-transform hover:scale-[1.02] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>

          {errorMessage && (
            <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </p>
          )}

          <p className="text-center text-sm text-white/45">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-200/80 transition hover:text-blue-100">
              Login here.
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
