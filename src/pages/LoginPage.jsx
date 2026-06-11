import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi, saveAuth } from '../api';

const LoginPage = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call POST /api/auth/login via the API Gateway
      const data = await authApi.login(email, password);
      if (!data) {
        throw new Error('Empty response from server. Is the API Gateway running on port 8080?');
      }

      saveAuth(data);

      // Route based on role returned by the backend
      const role = data.role?.toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (role === 'TEACHER') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">

        {/* Left Side: Marketing Text */}
        <div className="login-left">
          <h1 className="marketing-title">RELEARN!</h1>
          <p className="marketing-text">
            A centralized, structured, and hassle-free<br />
            platform for students and teachers to manage<br />
            notes and assignments easily. Your academic<br />
            success starts here.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="login-right">
          <div className="login-card">

            <div className="card-header">
              <div className="logo-container">
                <div className="logo-icon-bg">
                  <BookOpen size={20} color="#fff" />
                </div>
                <span className="logo-text">RELEARN</span>
              </div>
            </div>

            <div className="card-title-section">
              <h2>Sign In</h2>
              <p>Access your portal.</p>
            </div>

            {/* Error message from backend */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">

              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                  
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="student@relearn.edu"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">PASSWORD</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot Password</a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
