import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';
import toast from 'react-hot-toast';

const CAT_ICONS = {
  'Road Damage':'🛣️','Garbage Issue':'🗑️','Water Leakage':'💧',
  'Street Light Failure':'💡','Drainage Problem':'🚰','Other':'📌',
};
const StatusBadge = ({ s }) => {
  const m = { Pending:'badge-pending', 'In Progress':'badge-progress', Solved:'badge-solved' };
  return <span className={`badge ${m[s]||''}`}>{s}</span>;
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status:'', category:'', search:'' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getAll({ ...filters, page, limit:12 });
      setComplaints(data.complaints||[]);
      setTotal(data.total||0);
      setTotalPages(data.pages||1);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const setF = (k,v) => { setFilters(f => ({...f,[k]:v})); setPage(1); };

  const quickStatus = async (id, status, e) => {
    e.preventDefault();
    try {
      const fd = new FormData(); fd.append('status', status);
      await complaintAPI.updateStatus(id, fd);
      toast.success(`Marked: ${status}`);
      load();
    } catch { toast.error('Update failed'); }
  };

  const del = async (id, e) => {
    e.preventDefault();
    if (!confirm('Delete this complaint?')) return;
    try { await complaintAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        <div className="rise" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom:6 }}>Admin</div>
            <h1 style={{ fontSize:26, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em' }}>All Complaints</h1>
            {total > 0 && <p style={{ fontSize:13.5, color:'var(--ink-3)', marginTop:4 }}>{total} total complaint{total!==1?'s':''}</p>}
          </div>
        </div>

        {/* Filters */}
        <div className="rise-2 card-inset" style={{ padding:'14px 16px', marginBottom:20, display:'grid', gridTemplateColumns:'1fr 155px 190px', gap:10 }}>
          <input type="text" placeholder="Search by title or citizen…" value={filters.search}
            onChange={e => setF('search', e.target.value)} style={{ padding:'8px 12px' }} />
          <select value={filters.status} onChange={e => setF('status', e.target.value)} style={{ padding:'8px 12px' }}>
            <option value="">All statuses</option>
            <option>Pending</option><option>In Progress</option><option>Solved</option>
          </select>
          <select value={filters.category} onChange={e => setF('category', e.target.value)} style={{ padding:'8px 12px' }}>
            <option value="">All categories</option>
            {Object.keys(CAT_ICONS).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="rise-3" style={{ border:'1px solid var(--rule)', borderRadius:4, overflow:'hidden' }}>
          {/* Head */}
          <div className="t-head" style={{ gridTemplateColumns:'2fr 1.2fr 1fr 110px 96px', gap:14, padding:'10px 18px' }}>
            {['Complaint','Citizen','Category','Status','Actions'].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding:20, display:'flex', flexDirection:'column', gap:8 }}>
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height:52 }} />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty" style={{ paddingTop:48, paddingBottom:48 }}>
              <div className="empty-icon">📭</div>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--ink-2)' }}>No complaints found</p>
            </div>
          ) : complaints.map((c, i) => (
            <Link key={c._id} to={`/complaints/${c._id}`} className="t-row"
              style={{ gridTemplateColumns:'2fr 1.2fr 1fr 110px 96px', gap:14, padding:'12px 18px', borderBottom: i<complaints.length-1 ? '1px solid var(--rule)' : 'none' }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</div>
                <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
              <div className="hide-sm" style={{ fontSize:13, color:'var(--ink-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.createdBy?.name||'—'}</div>
              <div className="hide-sm" style={{ fontSize:12.5, color:'var(--ink-2)' }}>{CAT_ICONS[c.category]||'📌'} {c.category}</div>
              <StatusBadge s={c.status} />
              <div style={{ display:'flex', gap:5, alignItems:'center' }} onClick={e => e.preventDefault()}>
                {c.status !== 'In Progress' && (
                  <button onClick={e => quickStatus(c._id,'In Progress',e)} className="btn btn-outline btn-sm" title="In Progress" style={{ padding:'5px 7px' }}>🔧</button>
                )}
                {c.status !== 'Solved' && (
                  <button onClick={e => quickStatus(c._id,'Solved',e)} className="btn btn-outline btn-sm" title="Solved" style={{ padding:'5px 7px' }}>✅</button>
                )}
                <button onClick={e => del(c._id,e)} className="btn btn-danger-outline btn-sm" title="Delete" style={{ padding:'5px 7px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:10, marginTop:24 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn btn-outline btn-sm">← Prev</button>
            <span style={{ fontSize:13, color:'var(--ink-3)', fontWeight:600 }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn btn-outline btn-sm">Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
