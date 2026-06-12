import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CAT_ICONS = {
  'Road Damage':'🛣️','Garbage Issue':'🗑️','Water Leakage':'💧',
  'Street Light Failure':'💡','Drainage Problem':'🚰','Other':'📌',
};
const StatusBadge = ({ s }) => {
  const m = { Pending:'badge-pending', 'In Progress':'badge-progress', Solved:'badge-solved' };
  return <span className={`badge ${m[s]||''}`}>{s}</span>;
};
const Row = ({ label, value }) => !value ? null : (
  <div style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid var(--rule)' }}>
    <span style={{ fontSize:12, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.06em', minWidth:110 }}>{label}</span>
    <span style={{ fontSize:13.5, color:'var(--ink)' }}>{value}</span>
  </div>
);

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ status:'', adminNote:'' });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  useEffect(() => {
    complaintAPI.getOne(id)
      .then(({ data }) => { setComplaint(data); setForm({ status:data.status, adminNote:data.adminNote||'' }); })
      .catch(() => toast.error('Could not load complaint'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleProof = e => {
    const f = e.target.files[0];
    if (f) { setProofFile(f); setProofPreview(URL.createObjectURL(f)); }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append('status', form.status);
      fd.append('adminNote', form.adminNote);
      if (proofFile) fd.append('solvedImage', proofFile);
      const { data } = await complaintAPI.updateStatus(id, fd);
      setComplaint(data);
      setProofFile(null); setProofPreview(null);
      toast.success('Complaint updated.');
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  if (loading) return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:28, height:28, border:'3px solid var(--rule)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.7s linear infinite', margin:'0 auto 12px' }}/>
        <p style={{ fontSize:13, color:'var(--ink-3)' }}>Loading…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!complaint) return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="empty">
        <div className="empty-icon">🔍</div>
        <p style={{ fontSize:15, fontWeight:700, color:'var(--ink-2)', marginBottom:12 }}>Complaint not found</p>
        <Link to="/complaints" className="btn btn-outline btn-md">Go back</Link>
      </div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        {/* Back */}
        <Link
          to={isAdmin ? '/admin/complaints' : '/complaints'}
          style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--ink-3)', textDecoration:'none', fontWeight:700, marginBottom:20, textTransform:'uppercase', letterSpacing:'0.06em' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>
          {/* Main content */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Header card */}
            <div className="card-ruled rise" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--rule)', display:'flex', alignItems:'center', gap:14, flexWrap:'wrap', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ fontSize:28, width:44, height:44, background:'var(--bg-inset)', border:'1px solid var(--rule)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {CAT_ICONS[complaint.category]||'📌'}
                  </div>
                  <div>
                    <h1 style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.02em', lineHeight:1.2 }}>{complaint.title}</h1>
                    <p style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:3 }}>{complaint.category}</p>
                  </div>
                </div>
                <StatusBadge s={complaint.status} />
              </div>

              {/* Description */}
              <div style={{ padding:'18px 24px' }}>
                <p style={{ fontSize:11.5, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Description</p>
                <p style={{ fontSize:14, color:'var(--ink)', lineHeight:1.75 }}>{complaint.description}</p>
              </div>

              {/* Meta rows */}
              <div style={{ padding:'0 24px 18px' }}>
                <Row label="Location"  value={complaint.location} />
                <Row label="Filed on"  value={new Date(complaint.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} />
                <Row label="Citizen"   value={complaint.createdBy?.name} />
                <Row label="Email"     value={complaint.createdBy?.email} />
              </div>

              {/* Admin note */}
              {complaint.adminNote && (
                <div style={{ margin:'0 24px 20px', padding:'14px 16px', background:'var(--accent-muted)', borderRadius:4, borderLeft:'3px solid var(--accent)' }}>
                  <p style={{ fontSize:11.5, fontWeight:800, color:'var(--accent-text)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Admin Response</p>
                  <p style={{ fontSize:13.5, color:'var(--ink)', lineHeight:1.6 }}>{complaint.adminNote}</p>
                </div>
              )}
            </div>

            {/* Images */}
            {(complaint.image || complaint.solvedImage) && (
              <div className="rise-2" style={{ display:'grid', gridTemplateColumns: complaint.image && complaint.solvedImage ? '1fr 1fr' : '1fr', gap:16 }}>
                {complaint.image && (
                  <div>
                    <p style={{ fontSize:11, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Issue Photo</p>
                    <img src={`http://localhost:5000${complaint.image}`} alt="Complaint"
                      style={{ width:'100%', height:200, objectFit:'cover', borderRadius:4, border:'1px solid var(--rule)' }} />
                  </div>
                )}
                {complaint.solvedImage && (
                  <div>
                    <p style={{ fontSize:11, fontWeight:800, color:'var(--ok)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Resolution Proof</p>
                    <img src={`http://localhost:5000${complaint.solvedImage}`} alt="Solved"
                      style={{ width:'100%', height:200, objectFit:'cover', borderRadius:4, border:'1px solid var(--ok)' }} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin sidebar */}
          {isAdmin ? (
            <div className="rise-2 card-ruled" style={{ padding:22, display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <p style={{ fontSize:11.5, fontWeight:800, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>Admin Panel</p>
                <div className="rule-accent" />
              </div>

              {/* Status buttons */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:800, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:9 }}>Update Status</label>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {['Pending','In Progress','Solved'].map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({...f, status:s}))}
                      style={{
                        padding:'10px 14px', borderRadius:4, cursor:'pointer', textAlign:'left',
                        fontFamily:'Nunito Sans, sans-serif', fontSize:13.5, fontWeight:700,
                        border: form.status===s ? '2px solid var(--accent)' : '1.5px solid var(--rule)',
                        background: form.status===s ? 'var(--accent-muted)' : 'var(--bg-card)',
                        color: form.status===s ? 'var(--accent-text)' : 'var(--ink-2)',
                        transition:'all 0.15s',
                        display:'flex', alignItems:'center', gap:8,
                      }}
                    >
                      <span>{s==='Pending'?'⏳':s==='In Progress'?'🔧':'✅'}</span>
                      {s}
                      {form.status===s && <span style={{ marginLeft:'auto', fontSize:11 }}>✓ Selected</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:800, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:9 }}>
                  Response Note
                  <span style={{ fontSize:11, color:'var(--ink-4)', textTransform:'none', letterSpacing:0, fontWeight:400, display:'block', marginTop:1 }}>Shown to the citizen</span>
                </label>
                <textarea rows={3} placeholder="What action has been taken or is planned…"
                  value={form.adminNote} onChange={e => setForm(f => ({...f, adminNote:e.target.value}))}
                  style={{ padding:'10px 14px', resize:'vertical' }}
                />
              </div>

              {/* Proof image */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:800, color:'var(--ink-2)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:9 }}>
                  Resolution Proof Photo
                  <span style={{ fontSize:11, color:'var(--ink-4)', textTransform:'none', letterSpacing:0, fontWeight:400, display:'block', marginTop:1 }}>
                    Attach a photo showing the issue is resolved
                  </span>
                </label>
                {proofPreview ? (
                  <div style={{ position:'relative' }}>
                    <img src={proofPreview} alt="Proof" style={{ width:'100%', height:150, objectFit:'cover', borderRadius:4, border:'1px solid var(--rule)' }} />
                    <button type="button" onClick={() => { setProofFile(null); setProofPreview(null); }}
                      className="btn btn-danger-outline btn-sm"
                      style={{ position:'absolute', top:8, right:8, background:'var(--bg-card)' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="upload-zone" style={{ padding:'22px 16px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:'var(--ink-4)', marginBottom:8 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--ink-2)', marginBottom:3 }}>Upload proof photo</span>
                    <span style={{ fontSize:11.5, color:'var(--ink-4)' }}>JPG, PNG · Max 5MB</span>
                    <input type="file" accept="image/*" onChange={handleProof} style={{ display:'none' }} />
                  </label>
                )}
                {complaint.solvedImage && !proofPreview && (
                  <p style={{ fontSize:12, color:'var(--ok)', marginTop:7, fontWeight:700 }}>✓ Proof photo on file — upload to replace</p>
                )}
              </div>

              <button onClick={handleUpdate} disabled={updating} className="btn btn-primary btn-full" style={{ marginTop:4 }}>
                {updating ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            /* Non-admin sidebar: status timeline */
            <div className="rise-2 card-inset" style={{ padding:20 }}>
              <p style={{ fontSize:11.5, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>Status Timeline</p>
              {[
                { s:'Pending', label:'Report received', done: true },
                { s:'In Progress', label:'Under investigation', done: complaint.status==='In Progress'||complaint.status==='Solved' },
                { s:'Solved', label:'Issue resolved', done: complaint.status==='Solved' },
              ].map((step, i) => (
                <div key={step.s} style={{ display:'flex', gap:12, marginBottom: i<2 ? 18 : 0 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                      borderColor: step.done ? 'var(--ok)' : 'var(--rule)',
                      background: step.done ? 'var(--ok-muted)' : 'var(--bg-card)',
                    }}>
                      {step.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    {i < 2 && <div style={{ width:2, flex:1, background: step.done ? 'var(--ok-muted)' : 'var(--rule)', marginTop:4 }} />}
                  </div>
                  <div style={{ paddingBottom: i<2 ? 0 : 0, minHeight: i<2 ? 36 : 'auto' }}>
                    <p style={{ fontSize:13, fontWeight:700, color: step.done ? 'var(--ink)' : 'var(--ink-3)', lineHeight:1.2 }}>{step.label}</p>
                    <p style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:2 }}>{step.s}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:720px){.container>div>div[style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
