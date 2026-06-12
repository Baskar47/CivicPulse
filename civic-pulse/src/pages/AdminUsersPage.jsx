import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data||[]))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        <div className="rise" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:14 }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom:6 }}>Admin</div>
            <h1 style={{ fontSize:26, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em' }}>User Directory</h1>
            <p style={{ fontSize:13.5, color:'var(--ink-3)', marginTop:4 }}>{users.length} registered citizen{users.length!==1?'s':''}</p>
          </div>
          <input type="text" placeholder="Search name or email…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ padding:'9px 14px', width:260 }} />
        </div>

        <div className="rise-2" style={{ border:'1px solid var(--rule)', borderRadius:4, overflow:'hidden' }}>
          <div className="t-head" style={{ gridTemplateColumns:'2fr 2fr 1.2fr 100px', gap:14, padding:'10px 20px' }}>
            {['Name','Email','Phone','Role'].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:52 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty" style={{ paddingTop:48, paddingBottom:48 }}>
              <div className="empty-icon">👥</div>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--ink-2)' }}>
                {search ? 'No users match your search' : 'No users registered'}
              </p>
            </div>
          ) : filtered.map((u, i) => (
            <div key={u._id} className="t-row"
              style={{ gridTemplateColumns:'2fr 2fr 1.2fr 100px', gap:14, padding:'13px 20px', borderBottom: i<filtered.length-1 ? '1px solid var(--rule)' : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <div className="avatar" style={{ width:32, height:32, fontSize:14, flexShrink:0 }}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize:13.5, fontWeight:700, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</span>
              </div>
              <div className="hide-sm" style={{ fontSize:13, color:'var(--ink-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
              <div className="hide-sm" style={{ fontSize:13, color:'var(--ink-3)' }}>{u.phone||<span style={{ opacity:.4 }}>—</span>}</div>
              <div>
                <span className={`badge ${u.role==='admin' ? 'badge-admin' : 'badge-citizen'}`}>
                  {u.role==='admin' ? 'Admin' : 'Citizen'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
