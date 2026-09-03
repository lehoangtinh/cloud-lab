import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null);

  // Lấy danh sách sinh viên (Câu 47, 59, 63)
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

  // Xử lý Thêm / Cập nhật sinh viên (Câu 49 & 61)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.name || !form.email) return alert("Vui lòng nhập đủ thông tin");

    if (editId) {
      // Gọi API PUT để Sửa
      await fetch(`/api/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditId(null);
    } else {
      // Gọi API POST để Thêm
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }

    setForm({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  // Gọi API DELETE để Xóa (Câu 62)
  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (s) => {
    setEditId(s._id);
    setForm({ studentId: s.studentId, name: s.name, email: s.email });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h2>Quản Lý Sinh Viên (MERN Stack)</h2>

      {/* Form nhập dữ liệu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
        />
        <input 
          placeholder="Họ tên" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
        />
        <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ studentId: '', name: '', email: '' }); }}>
            Hủy
          </button>
        )}
      </form>

      {/* Bảng hiển thị danh sách sinh viên */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Sửa</button>
                <button onClick={() => handleDelete(s._id)} style={{ marginLeft: '5px', color: 'red' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;