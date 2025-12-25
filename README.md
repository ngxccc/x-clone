# X-Clone Backend API

> A Twitter/X clone backend API built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#️-cấu-hình)
- [Chạy dự án](#-chạy-dự-án)
- [Scripts](#-scripts)
- [API Documentation](#-api-documentation)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)

## ✨ Tính năng

- 🔐 **Authentication & Authorization**
  - Đăng ký / Đăng nhập
  - JWT tokens (Access & Refresh)
  - Xác thực email
  - Quên mật khẩu / Đặt lại mật khẩu
- 👤 **User Management**
  - Xem và chỉnh sửa profile
  - Upload avatar
  - Follow / Unfollow users
  - Xem danh sách followers/following
- 🐦 **Tweets** (Coming soon)
  - Đăng tweet
  - Like / Unlike
  - Retweet
  - Reply
  - Hashtags
  - Media upload

## 🛠 Tech Stack

- **Runtime:** [Bun](https://bun.sh) v1.2.22+ (hoặc Node.js 18+)
- **Framework:** Express.js 5
- **Language:** TypeScript 5
- **Database:** MongoDB (Mongoose ODM)
- **Validation:** Zod
- **Authentication:** JWT + Bcrypt
- **Code Quality:** ESLint, Prettier

## 💻 Yêu cầu hệ thống

- Bun v1.2.22+ hoặc Node.js v18+
- MongoDB v6.0+
- Git

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd x-clone
```

### 2. Cài đặt dependencies

Sử dụng Bun (khuyến nghị):

```bash
bun install
```

Hoặc sử dụng npm:

```bash
npm install
```

### 3. Thiết lập MongoDB

#### Option 1: MongoDB Local

- Cài đặt MongoDB: <https://www.mongodb.com/try/download/community>
- Chạy MongoDB service:

  ```bash
  mongod
  ```

#### Option 2: MongoDB Atlas (Cloud)

- Tạo tài khoản tại: <https://www.mongodb.com/cloud/atlas>
- Tạo cluster mới (Free tier)
- Lấy connection string

## ⚙️ Cấu hình

Chi tiết: [.env.example](.env.example)

## 🚀 Chạy dự án

### Development mode (với hot reload)

```bash
bun dev
```

Server sẽ chạy tại: <http://localhost:4000>

### Production mode

1. Build TypeScript sang JavaScript:

```bash
bun run build
```

1. Chạy compiled code:

```bash
bun start
```

### Đồng bộ database indexes

```bash
bun run db:index
```

## 📜 Scripts

| Script                 | Mô tả                            |
| ---------------------- | -------------------------------- |
| `bun dev`              | Chạy dev server với hot reload   |
| `bun run build`        | Build TypeScript sang JavaScript |
| `bun start`            | Chạy production build            |
| `bun run lint`         | Kiểm tra code style với ESLint   |
| `bun run lint:fix`     | Tự động fix lỗi ESLint           |
| `bun run prettier`     | Kiểm tra format code             |
| `bun run prettier:fix` | Tự động format code              |
| `bun run db:index`     | Đồng bộ database indexes         |

## 📚 API Documentation

Chi tiết API endpoints xem tại: [docs/api.md](docs/api.md)

### Quick overview

**Authentication:**

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh-token` - Làm mới token

**Users:**

- `GET /api/users/me` - Lấy thông tin user hiện tại
- `GET /api/users/:username` - Xem profile
- `PATCH /api/users/me` - Cập nhật profile
- `POST /api/users/follow` - Follow user
- `DELETE /api/users/follow/:userId` - Unfollow

## 📁 Cấu trúc dự án

```txt
x-clone/
├── src/
│   ├── constants/         # Các hằng số
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── type.d.ts         # TypeScript type definitions
│   └── index.ts          # Entry point
├── docs/                 # Documentation
├── dist/                 # Compiled JavaScript (sau khi build)
├── .env                  # Environment variables (không commit)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── eslint.config.ts      # ESLint config
```

## 🔒 Security

- ✅ Passwords được hash với bcrypt
- ✅ JWT tokens cho authentication
- ✅ Input validation với Zod
- ✅ MongoDB injection protection
- ✅ CORS configuration
- ⚠️ Cần thêm: Rate limiting, Helmet.js

## 🤝 Contributing

Contributions, issues và feature requests đều được chào đón!

## 📝 License

MIT License

## 👨‍💻 Author

Dự án được xây dựng với ❤️ bởi Ngxc và Gemini, Copilot
