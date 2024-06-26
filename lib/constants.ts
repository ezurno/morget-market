/////////// FORM TYPE

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 10;
export const PASSWORD_MIN_LENGTH = 4;
export const TOKEN_MIN_LENGTH = 100000;
export const TOKEN_MAX_LENGTH = 999999;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

////////// ERROR MESSAGE

export const USERNAME_ERROR_INVALID_TYPE =
  "올바른 형식의 유저명을 입력해 주세요.";
export const USERNAME_ERROR_REQUIRED = "유저 명을 입력해 주세요.";
export const USERNAME_ERROR_MIN_LENGTH = "유저 명이 너무 짧습니다.";
export const USERNAME_ERROR_MAX_LENGTH = "유저 명이 너무 깁니다.";
export const USERNAME_ERROR_INVALID_NAME = "부적절한 유저 명 입니다.";

export const PASSWORD_ERROR_REGEX = "형식에 맞지 않는 비밀번호 입니다.";
export const PASSWORD_ERROR_MISMATCH = "비밀번호가 서로 다릅니다.";
export const PASSWORD_ERROR_REQUIRED = "비밀번호를 입력해 주세요.";

export const TOKEN_ERROR = "잘못 된 토큰 입니다.";
export const PHONE_ERROR = "전화번호 형식이 맞지 않습니다.";