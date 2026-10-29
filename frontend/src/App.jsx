import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  const [form, setForm] = useState({
    foodId: '', name: '', category: '', cuisine: '',
    price: 0, quantity: 0, description: '', imageUrl: ''
  });

  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    try {
      const url = keyword ? `${API_BASE}/api/foods?search=${keyword}` : `${API_BASE}/api/foods`;
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (err) {
      setMessage('Lỗi tải danh sách món ăn!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await axios.put(`${API_BASE}/api/foods/${form._id}`, form);
        setMessage('Cập nhật món ăn thành công!');
      } else {
        await axios.post(`${API_BASE}/api/foods`, form);
        setMessage('Thêm món ăn mới thành công!');
      }
      setForm({ foodId: '', name: '', category: '', cuisine: '', price: 0, quantity: 0, description: '', imageUrl: '' });
      fetchFoods();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (food) => {
    setForm(food);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return;
    try {
      await axios.delete(`${API_BASE}/api/foods/${id}`);
      setMessage('Xóa món ăn thành công!');
      fetchFoods();
    } catch (err) {
      setMessage('Lỗi khi xóa món ăn!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Quản Lý Món Ăn - MSSV: 236726</h1>
      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm theo tên, loại, vùng miền..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Tìm kiếm</button>
      </form>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '6px' }}>
        <h3>{form._id ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Mã món ăn (foodId)" value={form.foodId} onChange={e => setForm({...form, foodId: e.target.value})} disabled={!!form._id} required style={{ padding: '8px' }} />
          <input placeholder="Tên món ăn" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '8px' }} />
          <input placeholder="Loại món ăn" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required style={{ padding: '8px' }} />
          <input placeholder="Vùng miền" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} style={{ padding: '8px' }} />
          <input type="number" placeholder="Giá" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} required style={{ padding: '8px' }} />
          <input type="number" placeholder="Số lượng" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} required style={{ padding: '8px' }} />
        </div>
        <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} style={{ padding: '8px', width: '100%', marginTop: '10px', boxSizing: 'border-box' }} />
        <button type="submit" style={{ marginTop: '10px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {form._id ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {form._id && (
          <button type="button" onClick={() => setForm({ foodId: '', name: '', category: '', cuisine: '', price: 0, quantity: 0, description: '', imageUrl: '' })} style={{ marginLeft: '10px', padding: '8px 15px' }}>
            Hủy
          </button>
        )}
      </form>

      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Mã món</th>
              <th>Tên món</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(item => (
              <tr key={item._id}>
                <td>{item.foodId}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.price?.toLocaleString()} VNĐ</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => setSelectedFood(item)} style={{ marginRight: '5px' }}>Xem</button>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => handleDelete(item._id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedFood && (
        <div style={{ marginTop: '20px', border: '1px solid #007bff', padding: '15px', borderRadius: '6px', backgroundColor: '#f8f9fa' }}>
          <h3>Chi Tiết Món Ăn</h3>
          <p><b>Mã món:</b> {selectedFood.foodId}</p>
          <p><b>Tên món:</b> {selectedFood.name}</p>
          <p><b>Loại món:</b> {selectedFood.category}</p>
          <p><b>Vùng miền:</b> {selectedFood.cuisine}</p>
          <p><b>Giá:</b> {selectedFood.price?.toLocaleString()} VNĐ</p>
          <p><b>Mô tả:</b> {selectedFood.description}</p>
          {selectedFood.imageUrl && <img src={selectedFood.imageUrl} alt={selectedFood.name} style={{ maxWidth: '200px', borderRadius: '4px' }} />}
          <br />
          <button onClick={() => setSelectedFood(null)} style={{ marginTop: '10px', padding: '5px 15px' }}>Đóng</button>
        </div>
      )}
    </div>
  );
}

export default App;