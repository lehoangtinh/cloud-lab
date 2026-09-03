import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.name || !form.email) return alert("Vui lòng điền đủ thông tin");

    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h2>Quản Lý Sinh Viên</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        <input placeholder="MSSV" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
        <input placeholder="Họ tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <button type="submit">Thêm Sinh Viên</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;