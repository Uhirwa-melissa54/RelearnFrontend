import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Shield,
  Handshake,
  Scale,
  Globe,
  Mail,
  Phone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const values = [
    {
      icon: <Handshake size={32} />,
      title: 'Trust & Integrity',
      text: 'A secure academic ecosystem where students and educators collaborate with transparency and reliability.',
    },
    {
      icon: <Globe size={32} />,
      title: 'Anytime Access',
      text: 'Access learning materials, assignments, and academic records anytime, anywhere, on any device.',
    },
    {
      icon: <Scale size={32} />,
      title: 'Structured Learning',
      text: 'Everything organized in one place — clear workflows, deadlines, and academic tracking without chaos.',
    },
  ];

  const services = [
    { icon: <BookOpen size={28} />, title: 'Course Materials', text: 'Lecturers upload structured learning resources organized by course and class.' },
    { icon: <ClipboardList size={28} />, title: 'Assignments', text: 'Create, submit, and evaluate academic work through a unified workflow system.' },
    { icon: <GraduationCap size={28} />, title: 'Student Dashboard', text: 'Personalized overview of progress, deadlines, and academic performance insights.' },
    { icon: <Users size={28} />, title: 'Instructor Portal', text: 'Manage classes, distribute materials, and review student submissions efficiently.' },
    { icon: <BarChart3 size={28} />, title: 'Analytics Dashboard', text: 'Institution-level insights on performance, engagement, and academic trends.' },
    { icon: <Shield size={28} />, title: 'Secure Access', text: 'Role-based authentication ensuring safe and controlled access for all users.' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message received. Our team will respond shortly.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="landing-page">

      {/* Top Bar */}
      <div className="landing-topbar">
        <div className="landing-container landing-topbar-inner">
          <a href="mailto:support@relearn.edu" className="topbar-link">
            <Phone size={14} /> Support: support@relearn.edu
          </a>
          <span className="topbar-hours">
            <Clock size={14} /> Mon–Fri: 08:00 – 18:00
          </span>
          <Link to="/login" className="topbar-login-btn">
            Student Access
          </Link>
        </div>
      </div>

      {/* Navbar */}
      <header className="landing-navbar">
        <div className="landing-container landing-navbar-inner">
          <Link to="/" className="landing-logo">
            <BookOpen size={26} />
            <span>RELEARN</span>
          </Link>

          <nav className="landing-nav">
            <a href="#inicio">Home</a>
            <a href="#sobre">Overview</a>
            <a href="#servicos">Features</a>
            <a href="#contacto">Contact</a>
          </nav>

          <Link to="/login" className="landing-cta-btn">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="landing-hero">
        <div className="landing-hero-overlay" />
        <div className="landing-container landing-hero-content">
          <h1>Modern education, built for clarity and performance.</h1>
          <p>
            A unified academic platform where students, educators, and administrators
            collaborate seamlessly — managing courses, assignments, and progress in one place.
          </p>
          <Link to="/login" className="landing-hero-btn">
            Enter Platform
          </Link>
        </div>
      </section>

      {/* Values */}
      <section id="sobre" className="landing-values">
        <div className="landing-container landing-values-grid">
          {values.map((v) => (
            <div key={v.title} className="value-card">
              <div className="value-card-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="landing-services">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>Platform Features</h2>
            <p>
              Everything you need for a seamless digital academic experience.
            </p>
          </div>

          <div className="services-grid">
            {services.map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Link to="/login" className="service-link">
                  Explore <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="landing-contact">
        <div className="landing-container landing-contact-grid">

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <input
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <textarea
              rows={4}
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />

            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions or need support? Our team is here to help you.
            </p>

            <div className="contact-phone">
              <Phone size={22} />
              <span>+351 800 000 000</span>
            </div>

            <div className="contact-email">
              <Mail size={18} />
              <span>support@relearn.edu</span>
            </div>

            <Link to="/login" className="contact-login-link">
              Access Platform <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div className="footer-logo">
            <BookOpen size={22} />
            <span>RELEARN</span>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Relearn. Built for modern academic excellence.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;