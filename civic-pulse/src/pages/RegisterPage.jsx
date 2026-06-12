import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Sun = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const Field = ({ label, fkey, type='text', placeholder='', required=true, form, setForm }) => (
  <div>
    <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'var(--ink-2)', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.05em' }}>
      {label} {!required && <span style={{ color:'var(--ink-4)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(optional)</span>}
    </label>
    <input type={type} placeholder={placeholder} value={form[fkey]}
      onChange={e => setForm({ ...form, [fkey]: e.target.value })}
      style={{ padding:'10px 14px' }} required={required}
      minLength={fkey === 'password' ? 6 : undefined}
    />
  </div>
);

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data);
      toast.success('Account created!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
      <button className="theme-btn" onClick={toggleTheme} style={{ position:'fixed', top:20, right:20, zIndex:10 }}>
        {isDark ? <Sun /> : <Moon />}
      </button>

      <div style={{ width:'100%', maxWidth:460 }} className="rise">
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <Link to="/login" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24, textDecoration:'none' }}>
            <div className="logo-icon" style={{ width:30, height:30 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ fontFamily:'Fraunces, serif', fontWeight:700, fontSize:16, color:'var(--ink)' }}>CivicPulse</span>
          </Link>
          <div className="section-eyebrow" style={{ marginBottom:8 }}>New Account</div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em', marginBottom:6 }}>Create your account</h1>
          <p style={{ fontSize:14, color:'var(--ink-3)' }}>Join to report and track civic issues in your area.</p>
        </div>

        <div className="card-ruled" style={{ padding:28 }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div style={{ gridColumn:'1 / -1' }}>
                <Field label="Full Name" fkey="name" placeholder="Your full name" form={form} setForm={setForm} />
              </div>
              <div style={{ gridColumn:'1 / -1' }}>
                <Field label="Email Address" fkey="email" type="email" placeholder="you@example.com" form={form} setForm={setForm} />
              </div>
              <Field label="Phone" fkey="phone" type="tel" placeholder="9876543210" required={false} form={form} setForm={setForm} />
              <Field label="Password" fkey="password" type="password" placeholder="Min. 6 characters" form={form} setForm={setForm} />
            </div>

            <div style={{ height:1, background:'var(--rule)', margin:'4px 0' }} />

            <button type="submit" disabled={loading} className="btn btn-primary btn-full">
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontSize:13.5, color:'var(--ink-3)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
