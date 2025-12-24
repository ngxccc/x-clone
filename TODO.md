# TODO List

## 1. Tính năng cốt lõi (Core Features)

### Tweets API

- [ ] **POST /api/tweets** - Tạo tweet mới (Text)
- [ ] **GET /api/tweets** - Lấy timeline (New feeds)
- [ ] **GET /api/tweets/:id** - Xem chi tiết tweet
- [ ] **DELETE /api/tweets/:id** - Xóa tweet

### Tương tác (Interactions)

- [ ] Like / Unlike tweet
- [ ] Retweet (đăng lại)
- [ ] Reply (trả lời)
- [ ] Quote tweet (trích dẫn)

### Media

- [ ] Upload ảnh/video cho tweet

---

## 2. Bảo mật & Hạ tầng (Security & Infrastructure)

### Authentication

- [ ] **Auth Refactor** - Xóa logic đăng nhập hardcoded (`email === "ngxc@gmail.com"`) trong `auth.controllers.ts` và thay bằng kiểm tra password thật

### Security Enhancement

- [ ] **Rate Limiting** - Giới hạn số lượng request
- [ ] **Helmet.js** - Bảo mật HTTP headers

### Deployment

- [ ] Cấu hình Docker/CI-CD

---

## 3. Logic Nghiệp vụ & Database (Business Logic)

- [ ] **Trending System** - Triển khai thuật toán tính Trending Hashtag dựa trên field `last_updated` và `count` trong `Hashtag.ts`
  - Logic: Tag nào được dùng nhiều nhất GẦN ĐÂY

- [ ] **User Stats** - Đảm bảo logic tăng/giảm `followers_count`, `tweet_count` trong `User.ts` hoạt động chính xác
  - Database Hooks hoặc Service logic

- [ ] **Token Cleanup** - Kiểm tra tính năng TTL Index của `RefreshToken` xem có tự động xóa token hết hạn đúng không

---

## 4. Quy ước (Conventions)

- [x] **Terminology** - Rà soát toàn bộ code/API: Sử dụng thống nhất thuật ngữ `register/login` (thay vì `signup/signin`)
