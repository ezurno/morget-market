"use server";

import {
  PASSWORD_ERROR_MISMATCH,
  PASSWORD_ERROR_REGEX,
  PASSWORD_ERROR_REQUIRED,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_ERROR_INVALID_NAME,
  USERNAME_ERROR_INVALID_TYPE,
  USERNAME_ERROR_MAX_LENGTH,
  USERNAME_ERROR_MIN_LENGTH,
  USERNAME_ERROR_REQUIRED,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import { z } from "zod";

const checkUsername = (username: string) => {
  return !username.includes("potato");
};

const bothPasswordCheck = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  password === confirmPassword;
};
/**
 * Validation 을
 * 검증하기 위한 zod schema 생성
 */
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: USERNAME_ERROR_INVALID_TYPE,
        required_error: USERNAME_ERROR_REQUIRED,
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_ERROR_MIN_LENGTH)
      .max(USERNAME_MAX_LENGTH, USERNAME_ERROR_MAX_LENGTH)
      .toLowerCase()
      .trim()
      .refine(checkUsername, USERNAME_ERROR_INVALID_NAME),
    email: z.string().email().toLowerCase(),
    password: z
      .string({
        required_error: PASSWORD_ERROR_REQUIRED,
      })
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_ERROR_REGEX),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(bothPasswordCheck, {
    message: PASSWORD_ERROR_MISMATCH,
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  /** 객체 생성 */
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassowrd"),
  };

  //   /** zod 는 유효성 검사를 error 로 handling 하기 때문에 try-catch */
  //   try {
  //     formSchema.parse(data);
  //   } catch (error) {
  //     console.error(error);
  //   }

  /**
   * 하지만 safeParse 를 사용하면 try-catch 사용 안해도 됨
   */
  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
