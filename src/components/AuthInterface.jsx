import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function AuthInterface() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
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
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Decorators */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 60%)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)', filter: 'blur(40px)' }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32, zIndex: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,255,136,.15)", border: "1px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff88", marginBottom: 16 }}>
          <Hexagon size={28} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.5px", margin: 0 }}>GenAI<span style={{ color: "#00ff88" }}>Academy</span></h1>
        <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 8 }}>Authenticate to sync your curriculum progress to the cloud.</p>
      </div>

      <div style={{ width: '100%', maxWidth: 380, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, position: 'relative', zIndex: 10, boxShadow: '0 24px 60px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}>
        
        <h2 style={{ margin: "0 0 24px 0", fontSize: 20, fontWeight: 800, textAlign: 'center' }}>
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 20, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }}><Mail size={16} /></div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px 12px 40px', color: 'var(--text)', outline: 'none', transition: 'border-color .2s', fontSize: 14 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }}><Lock size={16} /></div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px 12px 40px', color: 'var(--text)', outline: 'none', transition: 'border-color .2s', fontSize: 14 }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'var(--neon)', border: 'none', borderRadius: 10, color: '#000', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}
          >
            {isSignUp ? <><UserPlus size={16} /> Sign Up</> : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text3)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ padding: '0 12px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          type="button"
          style={{ width: '100%', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text2)' }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--neon)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 12, textDecoration: 'underline' }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}
