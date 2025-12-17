Đây là bộ câu lệnh JavaScript (JS) đã được soạn sẵn để copy và dán trực tiếp vào Console của trình duyệt (Microsoft Edge) (F12 -> tab Console).

⚠️ Lưu ý quan trọng trước khi chạy:

- Mở trình duyệt.
- Truy cập vào địa chỉ: http://127.0.0.1:5000 (Trang chủ server của bạn). Phải làm bước này để tránh lỗi bảo mật (CORS) của trình duyệt chặn request.
- Nhấn F12 -> Chọn tab Console.
- Copy từng đoạn code bên dưới dán vào và nhấn Enter.

1. Cấu hình đường dẫn (Chạy dòng này đầu tiên)

```javascript
const BASE_URL = 'http://127.0.0.1:5000/nop-tien';
```

2. Lệnh lấy danh sách (GET ALL)
```javascript
fetch(BASE_URL + '/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
    console.log("✅ Danh sách nộp tiền:", data);
})
.catch(err => console.error("❌ Lỗi:", err));
```

3. Lấy nộp tiền theo ID (GET)
```javascript
// ⚠️ Thay ID thực tế
var nopTienId = 1;

fetch(BASE_URL + '/' + nopTienId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
    console.log("✅ Chi tiết nộp tiền:", data);
})
.catch(err => console.error("❌ Lỗi:", err));
```

4. Lấy danh sách nộp tiền theo HỘ KHẨU (GET)
```javascript
// ⚠️ Thay ho_khau_id thực tế
var hoKhauId = 1;

fetch(BASE_URL + '/ho-khau/' + hoKhauId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
    console.log("✅ Nộp tiền của hộ khẩu", hoKhauId, ":", data);
})
.catch(err => console.error("❌ Lỗi:", err));
```

5. Lệnh tạo mới (POST)
```javascript
// Thay HoKhauId và KhoanThuId cho đúng dữ liệu DB 
fetch(BASE_URL + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        "HoKhauId": 1,
        "KhoanThuId": 1,
        "SoTien": 100000,
        "NguoiNop": "Nguyễn Văn A"
    })
})
.then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
})
.then(data => {
    console.log("✅ Đã nộp tiền thành công!");
    console.log("👉 ID nộp tiền:", data.Id);
    console.log(data);
})
.catch(err => console.error("❌ Lỗi:", err));
```

6. Lệnh xóa (DELETE)
```javascript
// ⚠️ Thay ID thực tế
var nopTienIdCanXoa = 1;

fetch(BASE_URL + '/' + nopTienIdCanXoa, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
})
.then(async res => {
    if (res.ok) {
        console.log("✅ Đã xóa nộp tiền ID:", nopTienIdCanXoa);
    } else {
        const data = await res.json();
        console.warn("⚠️ Xóa thất bại:", data.message);
    }
})
.catch(err => console.error("❌ Lỗi:", err));
```