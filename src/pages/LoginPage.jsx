import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      if (email.toLowerCase().includes('teacher')) {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        {/* Left Side: Marketing Text */}
        <div className="login-left">
          <h1 className="marketing-title">
            RELEARN!
          </h1>
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

            <form onSubmit={handleLogin} className="login-form">
              
              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@relearn.edu"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">PASSWORD</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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

              <button type="submit" className="login-button">
                Sign In
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
