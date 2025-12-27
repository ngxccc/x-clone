# REST GUIDELINES

## 1. Quy tắc đặt tên (URI Naming)

Nguyên tắc vàng: **"URI là Danh từ, HTTP Method là Động từ"**.

- ✅ **Đúng:** Dùng danh từ số nhiều cho tài nguyên.
- `GET /users` (Lấy danh sách users)
- `GET /users/123` (Lấy user ID 123)
- `POST /users` (Tạo user mới)

- ❌ **Sai:** Chứa động từ trong URL.
- `/getUsers`, `/createUser`, `/updateUser`, `/deleteUser`.

- ✅ **Đúng:** Quan hệ cha-con (Sub-resources).
- `GET /users/123/tweets` (Lấy danh sách tweet của user 123).

- **Quy ước Case:** Sử dụng **kebab-case** (chữ thường nối gạch ngang) cho URL.
- `GET /api/refresh-token` (Đúng)
- `GET /api/refreshToken` (Hạn chế)

## 2. Quy tắc sử dụng HTTP Methods

Dùng đúng ý nghĩa của method để thao tác với dữ liệu:

| Method     | Ý nghĩa (CRUD) | Mô tả trong dự án X-Clone                                                      |
| ---------- | -------------- | ------------------------------------------------------------------------------ |
| **GET**    | **Read**       | Lấy dữ liệu (News feed, Profile, Tweet detail). Không thay đổi dữ liệu server. |
| **POST**   | **Create**     | Tạo mới (Register, Login, Tweet mới, Follow).                                  |
| **PUT**    | **Update**     | Thay thế **toàn bộ** tài nguyên (Ít dùng trong user profile).                  |
| **PATCH**  | **Update**     | Cập nhật **một phần** tài nguyên (Đổi avatar, sửa bio).                        |
| **DELETE** | **Delete**     | Xóa tài nguyên (Unfollow, Xóa tweet).                                          |

## 3. Quy tắc về HTTP Status Codes

Đừng chỉ dùng mỗi `200` và `500`. Hãy giúp Frontend biết chính xác chuyện gì xảy ra.

**Nhóm thành công (2xx):**

- `200 OK`: Thành công cho `GET`, `PUT`, `PATCH` hoặc `DELETE` (nếu có trả data).
- `201 Created`: Thành công cho `POST` (Tạo mới).
- `204 No Content`: Thành công cho `DELETE` (Xóa xong không cần trả data gì cả).

**Nhóm lỗi Client (4xx):**

- `400 Bad Request`: Lỗi chung chung (VD: Gửi sai JSON).
- `401 Unauthorized`: Chưa đăng nhập hoặc Token hết hạn (Authentication).
- `403 Forbidden`: Đã đăng nhập nhưng không có quyền (Authorization).
- `404 Not Found`: Không tìm thấy ID hoặc Resource.
- `409 Conflict`: Dữ liệu bị trùng (VD: Trùng email khi đăng ký).
- `415 Unsupported Media Type`: Định dạng file gửi lên không hợp lệ.
- `422 Unprocessable Entity`: Lỗi Validation (VD: Password ngắn, Email sai định dạng).

**Nhóm lỗi Server (5xx):**

- `500 Internal Server Error`: Lỗi logic code, sập database (Client không làm gì được).

## 4. Quy tắc định dạng dữ liệu (Response Format)

Thống nhất một format JSON trả về cho toàn bộ dự án để Frontend dễ xử lý tự động (interceptor).

**Cấu trúc chuẩn đề xuất:**

```json
{
  "message": "Mô tả ngắn gọn kết quả (Human readable)",
  "data": { ... },    // Dữ liệu chính (Object hoặc Array)
  "errors": { ... },  // Chi tiết lỗi (nếu có)
  "pagination": {     // Chỉ có khi phân trang
    "page": 1,
    "limit": 20,
    "total_pages": 10
  }
}

```

_Ví dụ áp dụng trong `x-clone` (file `src/controllers/auth.controllers.ts`):_

- Thay vì trả về object user trần trụi, hãy bọc trong `data`.

## 5. Quy tắc lọc, sắp xếp và phân trang (Filtering, Sorting, Paging)

Không tạo thêm API mới, hãy dùng **Query Parameters** trên method `GET`.

- **Lọc (Filtering):**
- `GET /tweets?type=1` (Lấy toàn bộ Retweet).

- **Sắp xếp (Sorting):**
- `GET /tweets?sort=created_at` (Tăng dần).
- `GET /tweets?sort=-stats.likes` (Giảm dần theo like).

- **Phân trang (Pagination):**
- `GET /users/123/followers?page=2&limit=20`.

## 6. Quy tắc Versioning (Phiên bản hóa)

Luôn có version trong URL để sau này nâng cấp không làm chết app cũ.

- `https://api.x-clone.com/v1/tweets`
- Trong dự án hiện tại, bạn đang để `/api/...`, nên sửa thành `/api/v1/...` trong `src/index.ts`.

## 7. Stateless (Phi trạng thái)

- Server không lưu Session của user trong RAM.
- Mọi request từ Client phải gửi kèm **Access Token** (JWT) ở header:
- `Authorization: Bearer <token>`

- API Refresh Token là ngoại lệ duy nhất cần truy cập DB để check `RefreshToken`.
