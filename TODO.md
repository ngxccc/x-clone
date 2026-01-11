# TODO List

## 1. Tính năng và API

### User & Relationships

- [x] **Đăng nhập với tài khoản Google (Client-Side Handling)** - METHOD: `POST`, ENDPOINT: `/auth/login/google`
- [x] **Lấy Public Profile người khác** - METHOD: `GET`, ENDPOINT: `/users/:username`
- [x] **Xem Profile** - METHOD: `GET`, ENDPOINT: `/users/me`
- [x] **Cập nhật Profile** - METHOD: `PATCH`, ENDPOINT: `/users/me`
- [x] **Follow user** - METHOD: `POST`, ENDPOINT: `/users/follow`
- [x] **Unfollow user** - METHOD: `DELETE`, ENDPOINT: `/users/follow/:followedUserId`
- [x] **Xem danh sách người theo dõi** - METHOD: `GET`, ENDPOINT: `/users/:userId/followers`
- [x] **Xem danh sách đang theo dõi** - METHOD: `GET`, ENDPOINT: `/users/:userId/following`
- [x] **Đổi mật khẩu** - METHOD: `PUT`, ENDPOINT: `/users/change-password`
- [ ] **Lấy danh sách Tweet của 1 User** - METHOD: `GET`, ENDPOINT: `/users/:userId/tweets`
- [ ] **Lấy danh sách Media của 1 User** - METHOD: `GET`, ENDPOINT: `/users/:userId/media`
- [ ] **Lấy danh sách Liked Tweets** - METHOD: `GET`, ENDPOINT: `/users/:userId/liked-tweets`
- [ ] **Chặn người dùng** - METHOD: `POST`, ENDPOINT: `/users/block`
- [ ] **Gỡ chặn người dùng** - METHOD: `DELETE`, ENDPOINT: `/users/block/:userId`
- [ ] **Xoá tài khoản vĩnh viễn** - METHOD: `DELETE`, ENDPOINT: `/users/me`

### Media Service

- [ ] **Upload ảnh** - METHOD: `POST`, ENDPOINT: `/media/upload-image`
- [ ] **Upload video (HLS Streaming)** - METHOD: `POST`, ENDPOINT: `/media/upload-video`

### Tweets

- [ ] **Tạo Tweet mới** - METHOD: `POST`, ENDPOINT: `/tweets`
- [ ] **Xem chi tiết Tweet** - METHOD: `GET`, ENDPOINT: `/tweets/:tweetId`
- [ ] **Lấy danh sách Comment/Reply** - METHOD: `GET`, ENDPOINT: `/tweets/:tweetId/children`
- [ ] **Lấy News Feed** - METHOD: `GET`, ENDPOINT: `/tweets/new-feeds`
- [ ] **Xóa Tweet** - METHOD: `DELETE`, ENDPOINT: `/tweets/:tweetId`
- [ ] **Chỉnh sửa Tweet** - METHOD: `PATCH`, ENDPOINT: `/tweets/:tweetId`
- [ ] **Retweet** - METHOD: `POST`, ENDPOINT: `/tweets/:tweetId/retweet`
- [ ] **Unretweet** - METHOD: `DELETE`, ENDPOINT: `/tweets/:tweetId/retweet`
- [ ] **Thêm bạn bè vào circle** - METHOD: `POST`, ENDPOINT: `/users/circle`
- [ ] **Bỏ bạn bè ra circle** - METHOD: `DELETE`, ENDPOINT: `/users/circle/:userId`

### Interactions

- [ ] **Like Tweet** - METHOD: `POST`, ENDPOINT: `/likes`
- [ ] **Unlike Tweet** - METHOD: `DELETE`, ENDPOINT: `/likes/:tweetId`
- [ ] **Lưu bài viết** - METHOD: `POST`, ENDPOINT: `/bookmarks`
- [ ] **Bỏ lưu** - METHOD: `DELETE`, ENDPOINT: `/bookmarks/:tweetId`
- [ ] **Xem danh sách đã lưu** - METHOD: `GET`, ENDPOINT: `/bookmarks`

### Search & Discovery

- [ ] **Tìm kiếm tổng hợp** - METHOD: `GET`, ENDPOINT: `/search`
- [ ] **Lấy Hashtag nổi bật** - METHOD: `GET`, ENDPOINT: `/hashtags/trending`

### Chat Realtime

- [ ] **Lấy danh sách cuộc trò chuyện** - METHOD: `GET`, ENDPOINT: `/conversations`
- [ ] **Lấy chi tiết tin nhắn trong 1 cuộc hội thoại** - METHOD: `GET`, ENDPOINT: `/conversations/:conversationId`
- [ ] **Gửi tin nhắn** - METHOD: `POST`, ENDPOINT: `/conversations/:receiverId/messages`

### Notifications

- [ ] **Lấy tất cả thông báo** - METHOD: `GET`, ENDPOINT: `/notifications`
- [ ] **Đánh dấu đã đọc** - METHOD: `PATCH`, ENDPOINT: `/notifications/:notificationId/read`
- [ ] **Đánh dấu tất cả đã đọc** - METHOD: `PATCH`, ENDPOINT: `/notifications/read-all`

### Security & Moderation

- [ ] **** - METHOD: `GET`, ENDPOINT: ``

### Advanced

- [ ] **Gợi ý bài viết (AI/Algorithm)** - METHOD: `GET`, ENDPOINT: `/tweets/suggested`

---

## 2. Bảo mật & Hạ tầng (Security & Infrastructure)

### Authentication

- [x] **Auth Refactor** - Xóa logic đăng nhập hardcoded (`email === "ngxc@gmail.com"`) trong `auth.controllers.ts` và thay bằng kiểm tra password thật
- [x] **Set Refresh Token into Cookie on Server**

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
