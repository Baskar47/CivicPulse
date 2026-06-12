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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([complaintAPI.getStats(), complaintAPI.getAll({ limit:7 })])
      .then(([s,c]) => { setStats(s.data); setRecent(c.data.complaints||[]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const solveRate = stats?.total ? Math.round((stats.solved/stats.total)*100) : 0;

  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        {/* Header */}
        <div className="rise" style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div className="section-eyebrow" style={{ marginBottom:6 }}>Control Panel</div>
              <h1 style={{ fontSize:26, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em', marginBottom:4 }}>
                Welcome, {user?.name?.split(' ')[0]}.
              </h1>
              <p style={{ fontSize:14, color:'var(--ink-3)' }}>Complaint management overview — all wards.</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:42, fontWeight:900, color:'var(--ok)', letterSpacing:'-0.04em', lineHeight:1 }}>{solveRate}<span style={{ fontSize:24 }}>%</span></div>
              <p style={{ fontSize:11.5, color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Resolution Rate</p>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="rise-2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))', gap:14, marginBottom:30 }}>
          {[
            { label:'Total Filed',   value:stats?.total,      color:'var(--ink)',    borderColor:'var(--rule-strong)' },
            { label:'Pending',       value:stats?.pending,    color:'var(--warn)',   borderColor:'var(--warn)' },
            { label:'In Progress',   value:stats?.inProgress, color:'var(--accent)', borderColor:'var(--accent)' },
            { label:'Resolved',      value:stats?.solved,     color:'var(--ok)',     borderColor:'var(--ok)' },
          ].map(s => (
            <div key={s.label} className="stat-tile" style={{ borderLeftColor:s.borderColor }}>
              <div className="stat-value" style={{ color:s.color }}>{s.value??'—'}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="rise-3" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:30 }}>
          {[
            { to:'/admin/complaints', label:'Manage Complaints', sub:'Review, update & respond', icon:'📋', color:'var(--accent)' },
            { to:'/admin/users',      label:'User Directory',    sub:'View all registered citizens', icon:'👥', color:'var(--ok)' },
          ].map(q => (
            <Link key={q.to} to={q.to} style={{
              padding:'18px 20px', borderRadius:4, textDecoration:'none',
              background:'var(--bg-card)', border:'1px solid var(--rule)',
              borderLeft:`3px solid ${q.color}`,
              display:'flex', alignItems:'center', gap:14,
              transition:'box-shadow 0.15s, transform 0.15s',
              boxShadow:'var(--shadow-xs)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow-xs)'; e.currentTarget.style.transform='none'; }}
            >
              <span style={{ fontSize:26 }}>{q.icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)' }}>{q.label}</div>
                <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{q.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:24, alignItems:'start' }}>
          {/* Recent complaints */}
          <div className="rise-4">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <h2 style={{ fontSize:15, fontWeight:800, color:'var(--ink)', letterSpacing:'-0.01em' }}>Recent Complaints</h2>
              <Link to="/admin/complaints" style={{ fontSize:13, color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>View all →</Link>
            </div>
            <div className="rule-accent" style={{ marginBottom:0 }} />
            <div style={{ border:'1px solid var(--rule)', borderTop:'none', borderRadius:'0 0 4px 4px', overflow:'hidden' }}>
              {loading ? (
                <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
                  {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:52 }} />)}
                </div>
              ) : recent.length === 0 ? (
                <div className="empty" style={{ paddingTop:40, paddingBottom:40 }}>
                  <p style={{ fontSize:14, color:'var(--ink-3)' }}>No complaints on record yet.</p>
                </div>
              ) : recent.map((c, i) => (
                <Link key={c._id} to={`/complaints/${c._id}`} className="t-row"
                  style={{ gridTemplateColumns:'1fr auto', gap:16, padding:'13px 18px', borderBottom: i<recent.length-1 ? '1px solid var(--rule)' : 'none' }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</div>
                    <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>
                      {CAT_ICONS[c.category]||'📌'} {c.category} · {c.createdBy?.name} · {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <StatusBadge s={c.status} />
                </Link>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rise-4 card-inset" style={{ padding:20 }}>
            <p style={{ fontSize:11.5, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:18 }}>Issues by Category</p>
            {stats?.byCategory?.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {stats.byCategory.map(b => {
                  const pct = stats.total ? Math.round((b.count/stats.total)*100) : 0;
                  return (
                    <div key={b._id}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontSize:12.5, color:'var(--ink-2)' }}>{CAT_ICONS[b._id]||'📌'} {b._id}</span>
                        <span style={{ fontSize:12, fontWeight:800, color:'var(--ink)' }}>{b.count} <span style={{ color:'var(--ink-4)', fontWeight:400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height:4, background:'var(--rule)', borderRadius:2 }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:'var(--accent)', borderRadius:2, transition:'width 0.7s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize:13, color:'var(--ink-3)', textAlign:'center', padding:'20px 0' }}>No data yet</p>
            )}
          </div>
        </div>
      </main>
      <style>{`@media(max-width:700px){div[style*="grid-template-columns: '1fr 280px'"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
