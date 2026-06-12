import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'Road Damage',          icon:'🛣️', desc:'Potholes, broken roads' },
  { value:'Garbage Issue',        icon:'🗑️', desc:'Uncollected waste' },
  { value:'Water Leakage',        icon:'💧', desc:'Pipe leaks, overflow' },
  { value:'Street Light Failure', icon:'💡', desc:'Broken lighting' },
  { value:'Drainage Problem',     icon:'🚰', desc:'Blocked drains' },
  { value:'Other',                icon:'📌', desc:'Other civic issues' },
];

export default function NewComplaintPage() {
  const [form, setForm] = useState({ title:'', description:'', category:'', location:'' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleImg = e => {
    const f = e.target.files[0];
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (image) fd.append('image', image);
      await complaintAPI.create(fd);
      toast.success('Report submitted successfully.');
      nav('/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        {/* Back + header */}
        <div className="rise" style={{ marginBottom:28 }}>
          <Link to="/complaints" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--ink-3)', textDecoration:'none', fontWeight:700, marginBottom:16, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to complaints
          </Link>
          <div className="section-eyebrow" style={{ marginBottom:6 }}>New Report</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em' }}>File a Complaint</h1>
          <p style={{ fontSize:14, color:'var(--ink-3)', marginTop:4 }}>Describe the issue clearly so the responsible team can act quickly.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start' }}>
          {/* Main column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Category grid */}
            <div>
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:12.5, fontWeight:800, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:2 }}>
                  Issue Category <span style={{ color:'var(--accent)' }}>*</span>
                </p>
                <div className="rule-accent" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setForm({...form, category:cat.value})}
                    style={{
                      padding:'14px 12px', borderRadius:4, textAlign:'left', cursor:'pointer',
                      background: form.category===cat.value ? 'var(--accent-muted)' : 'var(--bg-card)',
                      border: form.category===cat.value ? '2px solid var(--accent)' : '1.5px solid var(--rule)',
                      transition:'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize:22, marginBottom:6 }}>{cat.icon}</div>
                    <div style={{ fontSize:13, fontWeight:800, color: form.category===cat.value ? 'var(--accent-text)' : 'var(--ink)', lineHeight:1.2 }}>{cat.value}</div>
                    <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:3 }}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="card-ruled" style={{ padding:24 }}>
              <p style={{ fontSize:12.5, fontWeight:800, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:18 }}>Complaint Details</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:7 }}>
                    Title <span style={{ color:'var(--accent)' }}>*</span>
                  </label>
                  <input type="text" placeholder="Brief title of the issue" value={form.title}
                    onChange={e => setForm({...form,title:e.target.value})} style={{ padding:'10px 14px' }} required />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:7 }}>
                    Description <span style={{ color:'var(--accent)' }}>*</span>
                  </label>
                  <textarea rows={4} placeholder="Describe the problem in detail — duration, severity, any safety risks…"
                    value={form.description} onChange={e => setForm({...form,description:e.target.value})}
                    style={{ padding:'10px 14px', resize:'vertical' }} required />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:7 }}>
                    Location <span style={{ fontSize:11, color:'var(--ink-4)', textTransform:'none', letterSpacing:0 }}>(optional)</span>
                  </label>
                  <input type="text" placeholder="Street name, area or landmark" value={form.location}
                    onChange={e => setForm({...form,location:e.target.value})} style={{ padding:'10px 14px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Photo upload */}
            <div className="card-inset" style={{ padding:20 }}>
              <p style={{ fontSize:12.5, fontWeight:800, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:14 }}>
                Attach Photo
                <span style={{ fontSize:11, color:'var(--ink-4)', textTransform:'none', letterSpacing:0, fontWeight:400, display:'block', marginTop:2 }}>Optional — evidence helps</span>
              </p>
              {preview ? (
                <div style={{ position:'relative' }}>
                  <img src={preview} alt="Preview" style={{ width:'100%', height:160, objectFit:'cover', borderRadius:4, border:'1px solid var(--rule)' }} />
                  <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                    className="btn btn-danger-outline btn-sm"
                    style={{ position:'absolute', top:8, right:8, background:'var(--bg-card)' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <label className="upload-zone" style={{ padding:'28px 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:'var(--ink-4)', marginBottom:10 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style={{ fontSize:13.5, fontWeight:700, color:'var(--ink-2)', display:'block', marginBottom:4 }}>Upload photo</span>
                  <span style={{ fontSize:12, color:'var(--ink-4)' }}>Click or drag & drop · Max 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImg} style={{ display:'none' }} />
                </label>
              )}
            </div>

            {/* Checklist */}
            <div style={{ padding:'16px 18px', background:'var(--bg-stripe)', border:'1px solid var(--rule)', borderRadius:4 }}>
              <p style={{ fontSize:11.5, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Checklist</p>
              {['Category selected','Title filled in','Description added','Location added (recommended)'].map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                  <div style={{ width:16, height:16, borderRadius:2, background:'var(--ok-muted)', border:'1px solid var(--ok)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize:12.5, color:'var(--ink-2)' }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn btn-primary btn-full">
              {loading ? 'Submitting…' : 'Submit Report'}
            </button>
            <p style={{ fontSize:12, color:'var(--ink-3)', textAlign:'center', lineHeight:1.5 }}>
              Reports are reviewed by an admin within 24 hours.
            </p>
          </div>
        </form>
      </main>
      <style>{`@media(max-width:700px){form>div[style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
