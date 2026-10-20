import { useState, useEffect, useMemo } from 'react';

// Khai báo API URL chính thức trên Render
const API_URL = "https://mern-backend-236412.onrender.com/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("API Error:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // Lọc danh sách thời gian thực
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter(s =>
      (s.name || '').toLowerCase().includes(term) ||
      (s.studentId || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  // Thêm / Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.name || !form.email) return alert("Vui lòng điền đầy đủ thông tin!");
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    try {
      await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditId(null);
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    if (confirm("Xóa sinh viên này?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  // Chọn sửa
  const handleEdit = (s) => {
    setEditId(s._id);
    setForm({ studentId: s.studentId, name: s.name, email: s.email });
  };

  // Avatar viết tắt
  const getInitials = (name) => {
    if (!name) return 'SV';
    const words = name.trim().split(' ');
    return words.length === 1 
      ? words[0].substring(0, 2).toUpperCase() 
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="galaxy-app">
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .galaxy-app {
          min-height: 100vh;
          background: radial-gradient(ellipse at top, #180b38 0%, #0a051b 50%, #03010a 100%);
          color: #f8fafc;
          font-family: "Plus Jakarta Sans", system-ui, sans-serif;
          padding: 32px 16px;
          box-sizing: border-box;
        }

        .container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 2; }

        /* Card Glassmorphism */
        .galaxy-card {
          background: rgba(18, 10, 38, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        .galaxy-card:hover {
          border-color: rgba(236, 72, 153, 0.4);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(168, 85, 247, 0.2);
        }

        /* Inputs */
        .galaxy-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(10, 5, 25, 0.6);
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 10px;
          color: #fff;
          outline: none;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .galaxy-input:focus {
          border-color: #ec4899;
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.3);
          background: rgba(10, 5, 25, 0.85);
        }

        /* Nút Bấm Trong Suốt & Hiệu Ứng Bấm Co Nhẹ */
        .btn {
          padding: 12px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(8px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-sizing: border-box;
        }
        .btn:active {
          transform: scale(0.92) translateY(1px) !important;
          filter: brightness(1.2);
        }

        .btn-primary {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.45) 0%, rgba(236, 72, 153, 0.45) 100%);
          color: #fff;
          border: 1px solid rgba(236, 72, 153, 0.5);
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.65) 0%, rgba(236, 72, 153, 0.65) 100%);
          border-color: rgba(236, 72, 153, 0.8);
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(51, 65, 85, 0.35);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .btn-secondary:hover {
          background: rgba(51, 65, 85, 0.55);
          color: #fff;
          transform: translateY(-2px);
        }

        .btn-edit {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 6px 12px;
          font-size: 12px;
        }
        .btn-edit:hover {
          background: rgba(245, 158, 11, 0.3);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
          transform: translateY(-1px);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 6px 12px;
          font-size: 12px;
        }
        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
          transform: translateY(-1px);
        }

        /* Layout Grid Responsive */
        .main-grid { display: grid; grid-template-columns: 1fr 1.8fr; gap: 24px; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr; }
          .search-box { width: 100% !important; }
        }

        .row-anim { animation: fadeInUp 0.35s ease forwards; }
        .spinner {
          border: 3px solid rgba(168, 85, 247, 0.2);
          border-left-color: #ec4899;
          border-radius: 50%;
          width: 28px; height: 28px;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 10px auto;
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))', border: '1px solid rgba(236, 72, 153, 0.5)', color: '#fff', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '800' }}>✦ CLOUD LAB 06</span>
              <span style={{ color: '#38bdf8', fontSize: '12px', fontFamily: 'monospace' }}>• GALAXY PAAS</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #fff, #c084fc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Quản Lý Sinh Viên MERN Stack</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(24, 12, 48, 0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <span style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 10px #38bdf8' }}></span>
            <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700' }}>Render API Live</span>
          </div>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="galaxy-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚀</div>
            <div>
              <div style={{ color: '#c084fc', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Tổng sinh viên</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>{students.length}</div>
            </div>
          </div>

          <div className="galaxy-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🌌</div>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Trạng thái CSDL</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#34d399', marginTop: '2px' }}>MongoDB Atlas Cloud</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-grid">
          {/* Form */}
          <div className="galaxy-card">
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#ec4899' }}>
              {editId ? '✨ Cập Nhật Sinh Viên' : '🛸 Thêm Sinh Viên Mới'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#c084fc', fontWeight: '700', marginBottom: '6px' }}>MSSV</label>
                <input className="galaxy-input" placeholder="Ví dụ: B2012345" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#c084fc', fontWeight: '700', marginBottom: '6px' }}>HỌ VÀ TÊN</label>
                <input className="galaxy-input" placeholder="Ví dụ: Lê Hoàng Tính" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#c084fc', fontWeight: '700', marginBottom: '6px' }}>EMAIL</label>
                <input className="galaxy-input" placeholder="email@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editId ? 'Lưu Cập Nhật' : 'Xác Nhận Thêm'}
                </button>
                {editId && (
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm({ studentId: '', name: '', email: '' }); }}>
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table List */}
          <div className="galaxy-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#38bdf8' }}>✦ Danh Sách Sinh Viên</h3>
              <input className="galaxy-input search-box" placeholder="🔍 Tìm tên, MSSV..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '200px' }} />
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#c084fc', padding: '50px 0' }}>
                <div className="spinner"></div>
                <p style={{ margin: 0, fontSize: '13px' }}>Đang tải dữ liệu từ CSDL...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '50px 0' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌌</div>
                <p style={{ margin: 0, fontSize: '13px' }}>{searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu sinh viên.'}</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '420px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.2)', color: '#c084fc', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 8px' }}>Sinh viên</th>
                      <th style={{ padding: '10px 8px' }}>MSSV</th>
                      <th style={{ padding: '10px 8px' }}>Email</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, idx) => (
                      <tr key={s._id} className="row-anim" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', animationDelay: `${idx * 0.06}s` }}>
                        <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.6))', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#fff', fontWeight: '800', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {getInitials(s.name)}
                          </div>
                          <span style={{ color: '#fff', fontWeight: '600', whiteSpace: 'nowrap' }}>{s.name}</span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ fontFamily: 'monospace', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                            {s.studentId}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>{s.email}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => handleEdit(s)} className="btn btn-edit" style={{ marginRight: '6px' }}>Sửa</button>
                          <button onClick={() => handleDelete(s._id)} className="btn btn-delete">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;