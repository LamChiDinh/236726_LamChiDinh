# Hệ Thống Quản Lý Món Ăn - Cloud Application

## Thông Tin Sinh Viên
- MSSV: 236726
- Họ tên: Lâm Chí Dĩnh

## Đề Tài & Công Nghệ
- Mô tả: Ứng dụng quản lý danh mục món ăn (CRUD + Search).
- Công nghệ: React (Vite), Node.js, Express, MongoDB Atlas, Docker, Render.

## Cấu Trúc Thư Mục
- `/backend`: Node.js Express REST API
- `/frontend`: React Web Client

## Hướng Dẫn Chạy Chương Trình
1. Backend:
   - `cd backend && npm install && node server.js`
   - Docker: `docker run -p 5000:5000 lcdlamchidinh/backend`
2. Frontend:
   - `cd frontend && npm install && npm run dev`
   - Docker: `docker run -p 80:80 lcdlamchidinh/frontend`

## Thông Tin Triển Khai & Links Nộp Bài
- Link_GitHub: https://github.com/LamChiDinh/236726_LamChiDinh
- Link_Docker_Backend: https://hub.docker.com/r/lcdlamchidinh/backend
- Link_Docker_Frontend: https://hub.docker.com/r/lcdlamchidinh/frontend
- Link_Render_App: https://web-236726.onrender.com
- Link_Render_API: https://api-236726.onrender.com/api/foods
- Link_Data_MongoDB: mongodb+srv://lamchidinh:admin1234@cluster0.n9tkivq.mongodb.net/236726_LamChiDinh?retryWrites=true&w=majority