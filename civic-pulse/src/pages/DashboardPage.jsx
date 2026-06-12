import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CAT_ICONS = {
  'Road Damage':'🛣️','Garbage Issue':'🗑️','Water Leakage':'💧',
  'Street Light Failure':'💡','Drainage Problem':'🚰','Other':'📌',
};

const StatusBadge = ({ s }) => {
  const m = { Pending:'badge-pending', 'In Progress':'badge-progress', Solved:'badge-solved' };
  return <span className={`badge ${m[s]||''}`}>{s}</span>;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([complaintAPI.getStats(), complaintAPI.getAll({ limit:5 })])
      .then(([s,c]) => { setStats(s.data); setRecent(c.data.complaints||[]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const solveRate = stats?.total ? Math.round((stats.solved/stats.total)*100) : 0;

  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        {/* Page header */}
        <div className="rise" style={{ marginBottom:32 }}>
          <div className="section-eyebrow">Citizen Dashboard</div>
          <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.03em', color:'var(--ink)', marginBottom:4 }}>
            Good day, {user?.name?.split(' ')[0]}.
          </h1>
          <p style={{ fontSize:14, color:'var(--ink-3)' }}>Here's a snapshot of your civic reports.</p>
        </div>

        {/* Stats row */}
        <div className="rise-2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14, marginBottom:32 }}>
          {[
            { label:'Total Filed',   value:stats?.total,      color:'var(--ink)' },
            { label:'Pending',       value:stats?.pending,    color:'var(--warn)' },
            { label:'In Progress',   value:stats?.inProgress, color:'var(--accent)' },
            { label:'Resolved',      value:stats?.solved,     color:'var(--ok)' },
          ].map(s => (
            <div key={s.label} className="stat-tile">
              <div className="stat-value" style={{ color:s.color }}>{s.value ?? '—'}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rise-3" style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24, alignItems:'start' }}>
          {/* Recent complaints table */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:'var(--ink)', letterSpacing:'-0.01em' }}>Recent Reports</h2>
              <Link to="/complaints" style={{ fontSize:13, color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>View all →</Link>
            </div>
            <div className="rule-accent" style={{ marginBottom:0 }} />

            <div style={{ border:'1px solid var(--rule)', borderTop:'none', borderRadius:'0 0 4px 4px', overflow:'hidden' }}>
              {loading ? (
                <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
                  {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:56 }} />)}
                </div>
              ) : recent.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📭</div>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--ink-2)', marginBottom:4 }}>No reports filed yet</p>
                  <p style={{ fontSize:13, marginBottom:16 }}>Spotted an issue? Report it now.</p>
                  <Link to="/complaints/new" className="btn btn-primary btn-sm">File a report</Link>
                </div>
              ) : (
                recent.map((c, i) => (
                  <Link
                    key={c._id} to={`/complaints/${c._id}`}
                    className="t-row"
                    style={{ gridTemplateColumns:'auto 1fr auto', gap:14, padding:'13px 18px', borderBottom: i < recent.length-1 ? '1px solid var(--rule)' : 'none' }}
                  >
                    <div style={{ fontSize:20, width:30, textAlign:'center' }}>{CAT_ICONS[c.category]||'📌'}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</div>
                      <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{c.category} · {new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <StatusBadge s={c.status} />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* CTA card */}
            <div style={{
              background:'var(--accent)', borderRadius:4, padding:24,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
              <div style={{ position:'absolute', right:20, bottom:-30, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
              <div style={{ position:'relative' }}>
                <p style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Quick Action</p>
                <h3 style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:10, letterSpacing:'-0.02em' }}>
                  Spotted a civic issue?
                </h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.6, marginBottom:18 }}>
                  File a report and we'll make sure the right team gets notified.
                </p>
                <Link to="/complaints/new" style={{
                  display:'block', textAlign:'center', padding:'10px 0',
                  background:'rgba(255,255,255,0.18)', color:'#fff',
                  borderRadius:3, fontWeight:800, fontSize:13.5,
                  textDecoration:'none', border:'1px solid rgba(255,255,255,0.3)',
                  letterSpacing:'0.02em', transition:'background 0.15s',
                }}>
                  File a Report
                </Link>
              </div>
            </div>

            {/* Progress */}
            {stats?.total > 0 && (
              <div className="card-inset" style={{ padding:18 }}>
                <p style={{ fontSize:11, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Resolution Progress</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
                  <span style={{ fontFamily:'Fraunces, serif', fontSize:32, fontWeight:900, color:'var(--ok)', letterSpacing:'-0.04em' }}>{solveRate}%</span>
                  <span style={{ fontSize:12, color:'var(--ink-3)', fontWeight:700 }}>of your reports resolved</span>
                </div>
                <div style={{ height:6, background:'var(--rule)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${solveRate}%`, background:'var(--ok)', borderRadius:3, transition:'width 0.8s ease' }} />
                </div>

                {stats?.byCategory?.length > 0 && (
                  <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:10 }}>
                    <p style={{ fontSize:11, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>By Category</p>
                    {stats.byCategory.map(b => {
                      const pct = stats.total ? Math.round((b.count/stats.total)*100) : 0;
                      return (
                        <div key={b._id}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                            <span style={{ fontSize:12.5, color:'var(--ink-2)' }}>{CAT_ICONS[b._id]||'📌'} {b._id}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:'var(--ink)' }}>{b.count}</span>
                          </div>
                          <div style={{ height:3, background:'var(--rule)', borderRadius:2 }}>
                            <div style={{ height:'100%', width:`${pct}%`, background:'var(--accent)', borderRadius:2, transition:'width 0.6s' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <style>{`@media(max-width:700px){.rise-3>div[style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
