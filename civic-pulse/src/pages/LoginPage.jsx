import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Sun = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      toast.success('Welcome back.');
      nav(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex' }}>
      {/* Theme toggle */}
      <button className="theme-btn" onClick={toggleTheme} style={{ position:'fixed', top:20, right:20, zIndex:10 }}>
        {isDark ? <Sun /> : <Moon />}
      </button>

      {/* Left decorative panel */}
      <div className="hide-sm" style={{
        width: 420, flexShrink: 0,
        background: 'var(--accent)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Pattern */}
        <div style={{
          position:'absolute', inset:0, opacity:0.08,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.8) 39px, rgba(255,255,255,0.8) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.8) 39px, rgba(255,255,255,0.8) 40px)',
        }} />

        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:64 }}>
            <div style={{ width:36, height:36, background:'rgba(255,255,255,0.25)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ fontFamily:'Fraunces, serif', fontWeight:700, fontSize:20, color:'#fff', letterSpacing:'-0.02em' }}>CivicPulse</span>
          </div>

          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:38, fontWeight:900, color:'#fff', lineHeight:1.15, letterSpacing:'-0.03em', marginBottom:18 }}>
            Your city.<br />Your voice.<br />Your record.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:15, lineHeight:1.7 }}>
            Report civic issues — roads, drainage, lighting, waste — and track them to resolution.
          </p>
        </div>

        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', gap:16, marginBottom:8 }}>
            {[['—', 'Roads fixed'], ['—', 'Issues resolved'], ['—', 'Citizens served']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily:'Fraunces, serif', fontSize:22, fontWeight:900, color:'#fff' }}>{n}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Civic Complaint Management System</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:400 }} className="rise">
          <div style={{ marginBottom:36 }}>
            {/* Mobile logo */}
            <div className="show-sm" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
              <div className="logo-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
              <span style={{ fontFamily:'Fraunces, serif', fontWeight:700, fontSize:18, color:'var(--ink)' }}>CivicPulse</span>
            </div>

            <div className="section-eyebrow" style={{ marginBottom:8 }}>Citizen Portal</div>
            <h1 style={{ fontSize:28, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em', marginBottom:6 }}>Sign in</h1>
            <p style={{ fontSize:14, color:'var(--ink-3)' }}>Enter your credentials to access your account.</p>
          </div>

          <div className="card-ruled" style={{ padding:28 }}>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'var(--ink-2)', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Email Address
                </label>
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ padding:'10px 14px' }} required
                />
              </div>

              <div>
                <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'var(--ink-2)', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Password
                </label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} placeholder="Enter password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ padding:'10px 50px 10px 14px' }} required
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:11.5, fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop:4 }}>
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign:'center', marginTop:22, fontSize:13.5, color:'var(--ink-3)' }}>
            <Link to="/register" style={{ color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>Create a new account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
