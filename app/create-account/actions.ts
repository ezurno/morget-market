"use server";

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
        invalid_type_error: "올바른 형식의 유저명을 입력해 주세요.",
        required_error: "유저 명을 입력해 주세요.",
      })
      .min(3, "유저 명이 너무 짧습니다.")
      .max(10, "유저 명이 너무 깁니다.")
      .refine(checkUsername, "부적절한 유저 명 입니다."),
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
  })
  .refine(bothPasswordCheck, {
    message: "비밀번호가 서로 다릅니다.",
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
  }
}
