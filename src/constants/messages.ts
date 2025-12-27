export const ERROR_CODES = {
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
  VALIDATION_ERROR: "ValidationError",
  MONGO_DUPLICATE_KEY: 11000,
} as const;

export const USERS_MESSAGES = {
  USERNAME_IS_REQUIRED: "Username là bắt buộc",
  USERNAME_MIN_LENGTH: "Username phải có ít nhất 3 ký tự",
  USERNAME_MAX_LENGTH: "Username không được quá 255 ký tự",
  EMAIL_ALREADY_EXISTS: "Email đã tồn tại",
  EMAIL_IS_REQUIRED: "Email không được để trống",
  EMAIL_IS_INVALID: "Email không hợp lệ",
  EMAIL_INVALID_FORMAT: "Email không hợp lệ, vui lòng kiểm tra lại",
  EMAIL_OR_PASSWORD_INCORRECT: "Email hoặc mật khẩu không đúng",
  PASSWORD_IS_REQUIRED: "Mật khẩu là bắt buộc",
  PASSWORD_MIN_LENGTH: "Mật khẩu phải có ít nhất 6 ký tự",
  PASSWORD_MUST_NOT_BE_EMPTY: "Mật khẩu không được để trống",
  PASSWORD_NOT_STRONG:
    "Mật khẩu phải dài từ 6 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt",
  PASSWORD_MUST_BE_STRING: "Mật khẩu phải là chuỗi",
  CONFIRM_PASSWORD_IS_REQUIRED: "Xác nhận mật khẩu là bắt buộc",
  CONFIRM_PASSWORD_MUST_BE_THE_SAME: "Nhập lại mật khẩu không khớp",
  CONFIRM_PASSWORD_NOT_MATCH: "Xác nhận mật khẩu không khớp",
  DATE_OF_BIRTH_INVALID: "Ngày sinh không hợp lệ",
  DATE_OF_BIRTH_MUST_BE_ISO8601: "Ngày sinh phải theo chuẩn ISO8601",
  UNKNOWN_ERROR: "Lỗi không xác định",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  LOGIN_FAILED: "Đăng nhập thất bại",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  REGISTER_SUCCESS: "Đăng ký thành công",
  ACCESS_TOKEN_IS_REQUIRED: "Yêu cầu Access Token",
  ACCESS_TOKEN_INVALID_OR_EXPIRED: "Access Token không hợp lệ hoặc đã hết hạn",
  REFRESH_TOKEN_IS_REQUIRED: "Refresh Token là bắt buộc",
  REFRESH_TOKEN_INVALID_OR_EXPIRED:
    "Refresh Token không hợp lệ hoặc đã hết hạn",
  REFRESH_TOKEN_IS_USED_OR_NOT_EXIST:
    "Refresh token đã được sử dụng hoặc không tồn tại",
  INVALID_JSON_SYNTAX:
    "Dữ liệu gửi lên không đúng định dạng JSON (Syntax Error)",
  VALIDATION_DATA_ERROR: "Lỗi validation dữ liệu (Mongoose)",
  FIELD_ALREADY_EXISTS: (field: string) => `${field} đã tồn tại trong hệ thống`,
  TOKEN_EXPIRED_OR_INVALID: "Token hết hạn hoặc không hợp lệ",
  INTERNAL_SERVER_ERROR: "Lỗi server nội bộ",
  INVALID_CONTENT_TYPE:
    "Vui lòng gửi định dạng JSON (Content-Type: application/json)",
  INVALID_INPUT_DATA: "Lỗi dữ liệu đầu vào",
} as const;
