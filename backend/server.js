global.crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Backend is running healthy!' });
});

// 1. GET /api/foods & Tìm kiếm
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: regex },
          { category: regex },
          { cuisine: regex }
        ]
      };
    }
    const foods = await Food.find(query);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

// 2. GET /api/foods/:id
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

// 3. POST /api/foods
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, price, quantity } = req.body;
    if (!foodId || !name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Trùng mã món ăn (foodId đã tồn tại)' });
    }

    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm món ăn', error: err.message });
  }
});

// 4. PUT /api/foods/:id
app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.json(updatedFood);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật món ăn', error: err.message });
  }
});

// 5. DELETE /api/foods/:id
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.json({ message: 'Xóa món ăn thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa món ăn', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Kết nối thành công MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));