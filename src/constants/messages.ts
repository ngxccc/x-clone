export const ERROR_CODES = {
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  EMAIL_IS_VERIFIED: "EMAIL_IS_VERIFIED",
  ACCOUNT_IS_BANNED: "ACCOUNT_IS_BANNED",
  PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  RESEND_EMAIL_TOO_FAST: "RESEND_EMAIL_TOO_FAST",
  VALIDATION_ERROR: "ValidationError",
  MONGO_DUPLICATE_KEY: 11000,
} as const;

export const USERS_MESSAGES = {
  USERNAME_IS_REQUIRED: "Username là bắt buộc",
  USERNAME_MIN_LENGTH: "Username phải có ít nhất 3 ký tự",
  USERNAME_MAX_LENGTH: "Username không được quá 255 ký tự",
  USERNAME_INVALID:
    "Username chỉ được chứa chữ cái, số, dấu gạch dưới và dấu chấm",
  USERNAME_ALREADY_EXISTS: "Username đã tồn tại",
  USER_NOT_FOUND: "Người dùng này không tồn tại",

  EMAIL_ALREADY_EXISTS: "Email đã tồn tại",
  EMAIL_IS_REQUIRED: "Email không được để trống",
  EMAIL_IS_INVALID: "Email không hợp lệ",
  EMAIL_INVALID_FORMAT: "Email không hợp lệ, vui lòng kiểm tra lại",
  EMAIL_NOT_VERIFIED: "Email chưa được xác thực",
  EMAIL_OR_PASSWORD_INCORRECT: "Email hoặc mật khẩu không đúng",
  EMAIL_ALREADY_VERIFIED_BEFORE: "Email đã được xác thực",

  ACCOUNT_IS_BANNED:
    "Tài khoản này đã bị khoá. Chi tiết xin liện hệ quản trị viên",

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

  LOGIN_SUCCESS: "Đăng nhập thành công",
  LOGIN_FAILED: "Đăng nhập thất bại",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  REGISTER_SUCCESS: "Đăng ký thành công",
  EMAIL_VERIFY_SUCCESS: "Xác thực email thành công",
  REFRESH_TOKEN_SUCCESS: "Làm mới Refresh Token thành công",
  PASSWORD_RESET_SUCCESS: "Đặt lại mật khẩu thành công",
  GET_ME_SUCCESS: "Lấy thông tin người dùng thành công",
  FOLLOW_SUCCESS: "Theo dõi thành công",
  GET_PROFILE_SUCCESS: "Lấy thông tin người dùng thành công",
  UPDATE_ME_SUCCESS: "Cập nhật thông tin thành công",
  UNFOLLOW_SUCCESS: "Hủy theo dõi thành công",

  ACCESS_TOKEN_IS_REQUIRED: "Yêu cầu Access Token",
  ACCESS_TOKEN_INVALID_OR_EXPIRED: "Access Token không hợp lệ hoặc đã hết hạn",

  REFRESH_TOKEN_IS_REQUIRED: "Refresh Token là bắt buộc",
  REFRESH_TOKEN_INVALID_OR_EXPIRED:
    "Refresh Token không hợp lệ hoặc đã hết hạn",

  EMAIL_VERIFY_TOKEN_IS_REQUIRED: "Yêu cầu Email Verify Token",
  EMAIL_VERIFY_TOKEN_INVALID_OR_EXPIRED:
    "Email Verify Token không hợp lệ hoặc đã hết hạn",
  EMAIL_VERIFY_TOKEN_IS_USED_OR_NOT_EXIST:
    "Email Verify Token đã được sử dụng hoặc không tồn tại",
  CHECK_EMAIL_TO_VERIFY: "Đã gửi lại email xác thực, vui lòng kiểm tra hộp thư",

  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: "Yêu cầu Forgot Password Token",
  FORGOT_PASSWORD_TOKEN_INVALID_OR_EXPIRED:
    "Forgot Password Token không hợp lệ hoặc đã hết hạn",
  FORGOT_PASSWORD_TOKEN_IS_USED_OR_NOT_EXIST:
    "Forgot Password Token đã được sử dụng hoặc không tồn tại",
  CHECK_EMAIL_TO_RESET_PASSWORD: "Vui lòng kiểm tra email để đặt lại mật khẩu",

  RESEND_EMAIL_TOO_FAST: "Vui lòng đợi 1 phút trước khi yêu cầu gửi lại.",

  REFRESH_TOKEN_IS_USED_OR_NOT_EXIST:
    "Refresh Token đã được sử dụng hoặc không tồn tại",
  TOKEN_EXPIRED_OR_INVALID: "Token hết hạn hoặc không hợp lệ",

  INVALID_JSON_SYNTAX:
    "Dữ liệu gửi lên không đúng định dạng JSON (Syntax Error)",
  VALIDATION_DATA_ERROR: "Lỗi validation dữ liệu (Mongoose)",
  FIELD_ALREADY_EXISTS: (field: string) => `${field} đã tồn tại trong hệ thống`,
  INTERNAL_SERVER_ERROR: "Lỗi server nội bộ",
  INVALID_CONTENT_TYPE:
    "Vui lòng gửi định dạng JSON (Content-Type: application/json)",
  INVALID_INPUT_DATA: "Lỗi dữ liệu đầu vào",
  UNKNOWN_DEVICE: "Thiết bị không xác định",
  UNKNOWN_ERROR: "Lỗi không xác định",
  TOO_MANY_REQUESTS:
    "Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau 1 phút.",
  API_ENDPOINT_NOT_FOUND: "API endpoint không tìm thấy",
  WEBSITE_INVALID: "Website không hợp lệ",
  BIO_TOO_LONG: "Bio không được quá 160 ký tự",
  CANNOT_DO_SELF: "Không thể thực hiện với chính mình",
  USER_ID_INVALID: "ID người dùng không hợp lệ",
  ALREADY_FOLLOWED: "Bạn đã theo dõi người dùng này rồi",
  ALREADY_UNFOLLOWED: "Bạn chưa theo dõi người dùng này",
} as const;
