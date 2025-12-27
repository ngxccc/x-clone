# X-Clone API Documentation

## Mục lục

- [HTTP Status Codes](#http-status-codes)
- [Authentication API](#authentication-api)
- [Users API](#users-api)
- [Tweets API](#tweets-api)

---

## HTTP Status Codes

| Code | Ý nghĩa                | Mô tả                                               |
| ---- | ---------------------- | --------------------------------------------------- |
| 200  | OK                     | Request thành công                                  |
| 201  | Created                | Tạo resource thành công                             |
| 400  | Bad Request            | Dữ liệu không hợp lệ hoặc thiếu                     |
| 401  | Unauthorized           | Chưa đăng nhập hoặc token không hợp lệ              |
| 403  | Forbidden              | Không có quyền truy cập                             |
| 404  | Not Found              | Không tìm thấy resource                             |
| 409  | Conflict               | Xung đột dữ liệu (VD: email đã tồn tại)             |
| 415  | Unsupported Media Type | Phương tiện không được hỗ trợ (VD: không phải json) |
| 422  | Unprocessable Entity   | Validation error                                    |
| 500  | Internal Server Error  | Lỗi máy chủ                                         |

---

## Authentication API

**Base URL:** `/api/auth`

> 💡 **Lưu ý:** Sử dụng thuật ngữ `register/login` thay vì `signup/signin` để code dễ đọc và nhất quán.

### 1. Đăng ký tài khoản

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "123123",
  "dateOfBirth": "2006-10-21"
}
```

**Response (201):**

```json
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Errors:**

- `400`: Thiếu trường bắt buộc
- `409`: Email hoặc username đã tồn tại

---

### 2. Đăng nhập

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Errors:**

- `400`: Thiếu email hoặc password
- `401`: Email hoặc password không đúng

---

### 3. Đăng xuất

**Endpoint:** `POST /api/auth/logout`

**Headers:**

```txt
Authorization: Bearer {accessToken}
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**

```json
{
  "message": "Đăng xuất thành công"
}
```

---

### 4. Làm mới token

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**

- `401`: Refresh token không hợp lệ hoặc đã hết hạn

---

### 5. Xác thực email

**Endpoint:** `POST /api/auth/verify-email`

**Request Body:**

```json
{
  "emailVerifyToken": "verification_token_here"
}
```

**Response (200):**

```json
{
  "message": "Xác thực email thành công"
}
```

---

### 6. Quên mật khẩu

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "message": "Email khôi phục mật khẩu đã được gửi"
}
```

---

### 7. Đặt lại mật khẩu

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**

```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**

```json
{
  "message": "Đặt lại mật khẩu thành công"
}
```

---

## Users API

**Base URL:** `/api/users`

> 🔒 **Bảo mật:** Các endpoint này yêu cầu authentication (trừ GET profile)

### 1. Lấy thông tin tài khoản hiện tại

**Endpoint:** `GET /api/users/me`

**Headers:**

```txt
Authorization: Bearer {accessToken}
```

**Response (200):**

```json
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software Developer",
    "avatar": "https://example.com/avatar.jpg",
    "website": "https://johndoe.com",
    "stats": {
      "followers_count": 150,
      "following_count": 200,
      "tweet_count": 50
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Xem profile người khác

**Endpoint:** `GET /api/users/:username`

**Parameters:**

- `username` (path): Username của người dùng

**Response (200):**

```json
{
  "user": {
    "id": "user_id",
    "username": "janedoe",
    "bio": "Designer & Artist",
    "avatar": "https://example.com/avatar2.jpg",
    "website": "https://janedoe.com",
    "stats": {
      "followers_count": 500,
      "following_count": 300,
      "tweet_count": 120
    },
    "isFollowing": false,
    "createdAt": "2024-06-15T00:00:00.000Z"
  }
}
```

**Errors:**

- `404`: Không tìm thấy user

---

### 3. Cập nhật profile

**Endpoint:** `PATCH /api/users/me`

**Headers:**

```txt
Authorization: Bearer {accessToken}
```

**Request Body:**

```json
{
  "bio": "Updated bio",
  "website": "https://newwebsite.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**

```json
{
  "message": "Cập nhật profile thành công",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Updated bio",
    "avatar": "https://example.com/new-avatar.jpg",
    "website": "https://newwebsite.com"
  }
}
```

**Validation:**

- `bio`: Tối đa 160 ký tự
- `website`: Phải là URL hợp lệ

---

### 4. Follow người dùng

**Endpoint:** `POST /api/users/follow`

**Headers:**

```txt
Authorization: Bearer {accessToken}
```

**Request Body:**

```json
{
  "userId": "target_user_id"
}
```

**Response (200):**

```json
{
  "message": "Đã follow thành công",
  "isFollowing": true
}
```

**Errors:**

- `400`: Không thể follow chính mình
- `404`: Không tìm thấy user
- `409`: Đã follow user này rồi

---

### 5. Unfollow người dùng

**Endpoint:** `DELETE /api/users/follow/:userId`

**Headers:**

```txt
Authorization: Bearer {accessToken}
```

**Parameters:**

- `userId` (path): ID của người dùng cần unfollow

**Response (200):**

```json
{
  "message": "Đã unfollow thành công",
  "isFollowing": false
}
```

**Errors:**

- `404`: Không tìm thấy follow relationship

---

### 6. Lấy danh sách followers

**Endpoint:** `GET /api/users/:userId/followers`

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng mỗi trang (default: 20, max: 100)

**Response (200):**

```json
{
  "followers": [
    {
      "id": "user_id_1",
      "username": "follower1",
      "avatar": "https://example.com/avatar1.jpg",
      "bio": "Bio of follower 1",
      "isFollowing": true
    },
    {
      "id": "user_id_2",
      "username": "follower2",
      "avatar": "https://example.com/avatar2.jpg",
      "bio": "Bio of follower 2",
      "isFollowing": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 7. Lấy danh sách following

**Endpoint:** `GET /api/users/:userId/following`

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng mỗi trang (default: 20, max: 100)

**Response (200):**

```json
{
  "following": [
    {
      "id": "user_id_1",
      "username": "following1",
      "avatar": "https://example.com/avatar1.jpg",
      "bio": "Bio of following 1",
      "isFollowing": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "totalPages": 10
  }
}
```

---

## Tweets API

**Base URL:** `/api/tweets`

> 🚧 **Coming soon...**

### Planned endpoints

- `POST /api/tweets` - Tạo tweet mới
- `GET /api/tweets` - Lấy timeline
- `GET /api/tweets/:id` - Xem chi tiết tweet
- `DELETE /api/tweets/:id` - Xóa tweet
- `POST /api/tweets/:id/like` - Like tweet
- `DELETE /api/tweets/:id/like` - Unlike tweet
- `POST /api/tweets/:id/retweet` - Retweet
- `POST /api/tweets/:id/reply` - Reply tweet

---

## Ghi chú kỹ thuật

### Authentication Flow

1. User đăng nhập → Nhận `accessToken` (15 phút) và `refreshToken` (7 ngày)
2. Gửi `accessToken` trong header: `Authorization: Bearer {token}`
3. Khi `accessToken` hết hạn → Gọi `/refresh-token` với `refreshToken`
4. Đăng xuất → Xóa `refreshToken` khỏi database

### Database Models

**User:**

- username, email, password (hashed)
- bio, avatar, website
- stats: followers_count, following_count, tweet_count
- timestamps

**RefreshToken:**

- token, userId, expiresAt

**Tweet:**

- content, userId, media[], hashtags[]
- stats: likes_count, retweets_count, replies_count

**Follower:**

- followerId, followingId, createdAt
