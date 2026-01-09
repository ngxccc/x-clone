# TODO List

## 1. Tính năng và API

### User & Relationships

- [x] **Lấy Public Profile người khác** - METHOD: `GET`, ENDPOINT: `/users/:username`
- [x] **Cập nhật Profile** - METHOD: `PATCH`, ENDPOINT: `/users/me`
- [x] **Follow user** - METHOD: `POST`, ENDPOINT: `/users/follow`
- [x] **Unfollow user** - METHOD: `DELETE`, ENDPOINT: `/users/follow/:followedUserId`
- [x] **Xem danh sách người theo dõi** - METHOD: `GET`, ENDPOINT: `/users/:userId/followers`
- [ ] **Xem danh sách đang theo dõi** - METHOD: `GET`, ENDPOINT: `/users/:userId/following`

### Media Service

- [ ] **Upload ảnh** - METHOD: `POST`, ENDPOINT: `/media/upload-image`
- [ ] **Upload video (HLS Streaming)** - METHOD: `POST`, ENDPOINT: `/media/upload-video`

### Tweets

- [ ] **Tạo Tweet mới** - METHOD: `POST`, ENDPOINT: `/tweets`
- [ ] **Xem chi tiết Tweet** - METHOD: `GET`, ENDPOINT: `/tweets/:tweetId`
- [ ] **Lấy danh sách Comment/Reply** - METHOD: `GET`, ENDPOINT: `/tweets/:tweetId/children`
- [ ] **Lấy News Feed** - METHOD: `GET`, ENDPOINT: `/tweets/new-feeds`
- [ ] **Xóa Tweet** - METHOD: `DELETE`, ENDPOINT: `/tweets/:tweetId`

### Interactions

- [ ] **Like Tweet** - METHOD: `POST`, ENDPOINT: `/likes`
- [ ] **Unlike Tweet** - METHOD: `DELETE`, ENDPOINT: `/likes/:tweetId`
- [ ] **Lưu bài viết** - METHOD: `POST`, ENDPOINT: `/bookmarks`
- [ ] **Bỏ lưu** - METHOD: `DELETE`, ENDPOINT: `/bookmarks/:tweetId`
- [ ] **Xem danh sách đã lưu** - METHOD: `GET`, ENDPOINT: `/bookmarks`

### Search & Discovery

- [ ] **Tìm kiếm tổng hợp** - METHOD: `GET`, ENDPOINT: `/search`
- [ ] **Lấy Hashtag nổi bật** - METHOD: `GET`, ENDPOINT: `/hashtags/trending`

### Advanced

- [ ] **Thông báo** - METHOD: `GET`, ENDPOINT: `/notifications`
- [ ] **Chat Realtime** - METHOD: `GET`, ENDPOINT: `/conversations`
- [ ] **Gợi ý bài viết (AI/Algorithm)** - METHOD: `GET`, ENDPOINT: `/tweets/suggested`

---

## 2. Bảo mật & Hạ tầng (Security & Infrastructure)

### Authentication

- [x] **Auth Refactor** - Xóa logic đăng nhập hardcoded (`email === "ngxc@gmail.com"`) trong `auth.controllers.ts` và thay bằng kiểm tra password thật

### Security Enhancement

- [x] **Rate Limiting** - Giới hạn số lượng request
- [ ] **Helmet.js** - Bảo mật HTTP headers

### Deployment

- [ ] Cấu hình Docker/CI-CD

---

## 3. Logic Nghiệp vụ & Database (Business Logic)

- [ ] **Trending System** - Triển khai thuật toán tính Trending Hashtag dựa trên field `last_updated` và `count` trong `Hashtag.ts`
  - Logic: Tag nào được dùng nhiều nhất GẦN ĐÂY

- [x] **User Stats** - Đảm bảo logic tăng/giảm `followers_count`, `tweet_count` trong `User.ts` hoạt động chính xác
  - Database Hooks hoặc Service logic

- [ ] **Token Cleanup** - Kiểm tra tính năng TTL Index của `RefreshToken` xem có tự động xóa token hết hạn đúng không

---

## 4. Quy ước (Conventions)

- [x] **Terminology** - Rà soát toàn bộ code/API: Sử dụng thống nhất thuật ngữ `register/login` (thay vì `signup/signin`)

## Others

- [x] **Refactor** - Sửa lại định dạng JSON error thống nhất
- [x] **Refresh Token** - Thêm rate limit
