import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Eye,
  EyeOff,
  Hexagon,
  Layers3,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import '../styles/auth.css';

export default function AuthInterface({ onBackToLanding, theme, toggleTheme }) {
  const { signIn, signUp, signInWithGoogle, adminSignInMock } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMode, setLoginMode] = useState('user'); // 'user' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginMode === 'admin') {
        if (email === 'nandanpatkar14114@gmail.com' && password === 'Nandan@14114') {
          const { error: signInError } = await signIn(email, password);
          if (signInError) adminSignInMock();
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) throw signUpError;
        alert('Check your email for the confirmation link!');
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const { error: googleError } = await signInWithGoogle();
      if (googleError) throw googleError;
    } catch (err) {
      setError(err.message);
    }
  };

  const isAdmin = loginMode === 'admin';

  return (
    <main className={`auth-page ${theme === 'light' ? 'auth-page--light' : ''}`}>
      <div className="auth-page__ambient auth-page__ambient--one" />
      <div className="auth-page__ambient auth-page__ambient--two" />
      <div className="auth-page__grid" />
      <div className="auth-network" aria-hidden="true">
        <span className="auth-network__line" />
        <i className="auth-network__node auth-network__node--one" />
        <i className="auth-network__node auth-network__node--two" />
        <i className="auth-network__node auth-network__node--three" />
        <i className="auth-network__node auth-network__node--four" />
      </div>

      <header className="auth-topbar">
        {onBackToLanding ? (
          <button className="auth-back" onClick={onBackToLanding} type="button">
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </button>
        ) : <span />}

        {toggleTheme && (
          <button
            className="auth-theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <span className="auth-theme-toggle__dot" />
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        )}
      </header>

      <div className="auth-layout">
        <section className="auth-story" aria-label="GenAI Academy overview">
          <div className="auth-story__eyebrow">
            <span className="auth-story__eyebrow-dot" />
            Your AI engineering workspace
          </div>

          <div className="auth-brand auth-brand--story">
            <span className="auth-brand__mark"><Hexagon size={22} strokeWidth={2.2} /></span>
            <span>GenAI<span>Academy</span></span>
          </div>

          <h1>Build what’s next<br /><em>with clarity.</em></h1>
          <p className="auth-story__intro">
            One focused space to learn, practise, and ship the systems behind the AI era.
          </p>

          <div className="auth-story__cards">
            <div className="auth-story-card auth-story-card--primary">
              <div className="auth-story-card__icon"><BrainCircuit size={19} /></div>
              <div>
                <strong>Learn by building</strong>
                <span>Roadmaps, labs, and real-world patterns</span>
              </div>
              <ArrowUpRight className="auth-story-card__arrow" size={17} />
            </div>
            <div className="auth-story-card auth-story-card--secondary">
              <div className="auth-story-card__icon"><Layers3 size={19} /></div>
              <div>
                <strong>Keep your momentum</strong>
                <span>Your progress, saved and ready anywhere</span>
              </div>
              <div className="auth-story-card__progress"><i /><i /><i /><i /><i /></div>
            </div>
          </div>

          <div className="auth-trust-line">
            <div className="auth-trust-line__avatars"><span>G</span><span>A</span><span>+</span></div>
            <span>Join a growing community of curious builders</span>
          </div>
        </section>

        <section className="auth-panel" aria-label={isAdmin ? 'Admin sign in' : 'Learner sign in'}>
          <div className="auth-panel__topline">
            <div className="auth-brand auth-brand--panel">
              <span className="auth-brand__mark"><Hexagon size={18} strokeWidth={2.2} /></span>
              <span>GenAI<span>Academy</span></span>
            </div>
            <span className="auth-panel__status"><span /> Secure access</span>
          </div>

          <div className="auth-panel__heading">
            <p className="auth-kicker">{isAdmin ? 'Restricted workspace' : isSignUp ? 'Start your journey' : 'Welcome back'}</p>
            <h2>{isAdmin ? 'Admin portal' : isSignUp ? 'Create your account' : 'Sign in to continue'}</h2>
            <p>{isAdmin ? 'Manage the Academy from a secure control room.' : 'Pick up where you left off and keep learning.'}</p>
          </div>

          <div className="auth-mode-switch" role="tablist" aria-label="Account type">
            <button
              className={!isAdmin ? 'is-active' : ''}
              onClick={() => { setLoginMode('user'); setError(null); }}
              type="button"
              role="tab"
              aria-selected={!isAdmin}
            >
              <span className="auth-mode-switch__icon"><Sparkles size={14} /></span>
              Learner
            </button>
            <button
              className={isAdmin ? 'is-active' : ''}
              onClick={() => { setLoginMode('admin'); setIsSignUp(false); setError(null); }}
              type="button"
              role="tab"
              aria-selected={isAdmin}
            >
              <span className="auth-mode-switch__icon"><ShieldCheck size={14} /></span>
              Admin
            </button>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <Mail size={17} aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <Lock size={17} aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                />
                <button
                  className="auth-input-action"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? 'Connecting…' : isAdmin ? 'Enter admin portal' : isSignUp ? 'Create account' : 'Continue to Academy'}</span>
              {!loading && (isSignUp ? <UserPlus size={17} /> : <LogIn size={17} />)}
            </button>
          </form>

          {!isAdmin && (
            <>
              <div className="auth-divider"><span>or continue with</span></div>
              <button className="auth-google" onClick={handleGoogleSignIn} type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.84-1.7 2.9-4.2 2.9-7.26Z" />
                  <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.15-2.45c-.87.58-1.98.93-3.3.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.5Z" />
                  <path fill="#FBBC05" d="M6.53 13.59a5.84 5.84 0 0 1 0-3.18V7.88H3.28a9.75 9.75 0 0 0 0 8.24l3.25-2.53Z" />
                  <path fill="#EA4335" d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.8-2.8C16.83 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C7.3 8.1 9.46 6.38 12 6.38Z" />
                </svg>
                Continue with Google
              </button>

              <p className="auth-switch-copy">
                {isSignUp ? 'Already have an account?' : 'New to GenAI Academy?'}{' '}
                <button type="button" onClick={() => { setIsSignUp((value) => !value); setError(null); }}>
                  {isSignUp ? 'Sign in' : 'Create an account'}
                </button>
              </p>
            </>
          )}

          <p className="auth-legal">By continuing, you agree to learn generously and build responsibly.</p>
          {isAdmin && <div className="auth-admin-note"><Check size={14} /> Admin access is monitored and protected</div>}
        </section>
      </div>
    </main>
  );
}
