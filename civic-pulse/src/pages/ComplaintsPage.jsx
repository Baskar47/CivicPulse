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

const DeleteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status:'', category:'', search:'' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getAll({ ...filters, page, limit:10 });
      setComplaints(data.complaints||[]);
      setTotalPages(data.pages||1);
      setTotal(data.total||0);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const setF = (k,v) => { setFilters(f => ({...f,[k]:v})); setPage(1); };

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
        {/* Header */}
        <div className="rise" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom:6 }}>My Reports</div>
            <h1 style={{ fontSize:26, fontWeight:900, color:'var(--ink)', letterSpacing:'-0.03em' }}>Complaints</h1>
            {total > 0 && <p style={{ fontSize:13.5, color:'var(--ink-3)', marginTop:4 }}>{total} complaint{total!==1?'s':''} on record</p>}
          </div>
          <Link to="/complaints/new" className="btn btn-primary btn-lg" style={{ gap:8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Report
          </Link>
        </div>

        {/* Filter bar */}
        <div className="rise-2 card-inset" style={{ padding:'14px 16px', marginBottom:20, display:'grid', gridTemplateColumns:'1fr 155px 180px', gap:10 }}>
          <input type="text" placeholder="Search reports…" value={filters.search}
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

        {/* List */}
        <div className="rise-3">
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:66, borderRadius:4 }} />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="card empty">
              <div className="empty-icon">📭</div>
              <p style={{ fontSize:15, fontWeight:800, color:'var(--ink-2)', marginBottom:6 }}>No complaints found</p>
              <p style={{ fontSize:13, marginBottom:18 }}>
                {filters.search||filters.status||filters.category ? 'Try adjusting your filters.' : 'File your first complaint to get started.'}
              </p>
              <Link to="/complaints/new" className="btn btn-primary btn-md">File a report</Link>
            </div>
          ) : (
            <div style={{ border:'1px solid var(--rule)', borderRadius:4, overflow:'hidden' }}>
              {/* Column headers */}
              <div className="t-head" style={{ gridTemplateColumns:'auto 1fr 140px 90px 80px', gap:14, padding:'9px 18px' }}>
                {['', 'Title & Category', 'Location', 'Status', ''].map((h,i) => (
                  <span key={i} style={{ fontSize:11, fontWeight:800, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</span>
                ))}
              </div>
              {complaints.map((c, i) => (
                <Link
                  key={c._id} to={`/complaints/${c._id}`}
                  className="t-row"
                  style={{ gridTemplateColumns:'auto 1fr 140px 90px 80px', gap:14, padding:'13px 18px', borderBottom: i<complaints.length-1 ? '1px solid var(--rule)' : 'none' }}
                >
                  <div style={{ fontSize:20, width:28, textAlign:'center' }}>{CAT_ICONS[c.category]||'📌'}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</div>
                    <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:2 }}>{c.category} · {new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div className="hide-sm" style={{ fontSize:12.5, color:'var(--ink-3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {c.location || <span style={{ opacity:.4 }}>—</span>}
                  </div>
                  <StatusBadge s={c.status} />
                  <div onClick={e => del(c._id, e)} style={{ display:'flex', justifyContent:'flex-end' }}>
                    <button className="btn btn-danger-outline btn-sm" title="Delete" style={{ padding:'5px 8px' }}>
                      <DeleteIcon />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginTop:28 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn btn-outline btn-sm">← Prev</button>
            <span style={{ fontSize:13, color:'var(--ink-3)', fontWeight:600 }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn btn-outline btn-sm">Next →</button>
          </div>
        )}
      </main>
      <style>{`.filter-grid{grid-template-columns:1fr!important}@media(max-width:600px){.rise-2{display:block!important}.rise-2 input,.rise-2 select{margin-bottom:8px}}`}</style>
    </div>
  );
}
