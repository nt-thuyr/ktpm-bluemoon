Đây là bộ câu lệnh JavaScript (JS) đã được soạn sẵn để copy và dán trực tiếp vào Console của trình duyệt (Microsoft Edge) (F12 -> tab Console).

⚠️ Lưu ý quan trọng trước khi chạy:

- Mở trình duyệt.
- Truy cập vào địa chỉ: http://127.0.0.1:5000 (Trang chủ server của bạn). Phải làm bước này để tránh lỗi bảo mật (CORS) của trình duyệt chặn request.
- Nhấn F12 -> Chọn tab Console.
- Copy từng đoạn code bên dưới dán vào và nhấn Enter.

1. Cấu hình đường dẫn (Chạy dòng này đầu tiên)

```javascript
const BASE_URL = 'http://127.0.0.1:5000/nhan-khau';
```

2. Lệnh lấy danh sách (GET ALL)
```javascript
fetch(BASE_URL + '/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
    console.log("✅ Danh sách nhân khẩu:", data);
})
.catch(err => console.error('❌ Lỗi kết nối:', err));
```

3. Lệnh tạo mới (POST)
```javascript
fetch(BASE_URL + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        "HoTen": "Nguyễn Văn Tét",
        "NgaySinh": "2000-01-01", 
        "GioiTinh": "Nam",        
        "DanToc": "Kinh",         
        "TonGiao": "Khong",       
        "cccd": "9999" + Math.floor(Math.random() * 10000), 
        "NgayCap": "2022-01-01",  
        "NoiCap": "Ha Noi",       
        "NgheNghiep": "Tester",   
        "GhiChu": "Tao bang lenh fetch" 
    })
})
.then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
})
.then(data => {
    console.log("✅ Đã tạo thành công! ID mới là:", data.id);
    console.log(data);
})
.catch(err => console.error('❌ Lỗi:', err));
```

4. Lệnh cập nhật (PUT)
```javascript
// ⚠️ Thay số ID bên dưới bằng ID thực tế bạn vừa tạo được ở bước 3
var idCanSua = 1; 

fetch(BASE_URL + '/' + idCanSua, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        "HoTen": "Nguyễn Văn Mới", 
        "NgheNghiep": "Giam Doc",  
        "GhiChu": "Update tu Console"
    })
})
.then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
})
.then(data => console.log("✅ Cập nhật xong:", data))
.catch(err => console.error('❌ Lỗi:', err));
```

5. Lệnh xóa (DELETE)
```javascript
// ⚠️ Thay số ID thực tế bạn muốn xóa
var idCanXoa = 1; 

fetch(BASE_URL + '/' + idCanXoa, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
})
.then(res => {
    if (res.ok) console.log("✅ Đã xóa thành công ID:", idCanXoa);
    else console.log("⚠️ Xóa thất bại, mã lỗi:", res.status);
})
.catch(err => console.error('❌ Lỗi kết nối:', err));
```