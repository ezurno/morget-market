"use server";

import {
  EMAIL_ERROR_INVALID_EMAIL_UNIQUE,
  PASSWORD_ERROR_MISMATCH,
  PASSWORD_ERROR_REGEX,
  PASSWORD_ERROR_REQUIRED,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_ERROR_INVALID_NAME,
  USERNAME_ERROR_INVALID_NAME_UNIQUE,
  USERNAME_ERROR_INVALID_TYPE,
  USERNAME_ERROR_MAX_LENGTH,
  USERNAME_ERROR_MIN_LENGTH,
  USERNAME_ERROR_REQUIRED,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => {
  return !username.includes("potato");
};

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user) === false;
};

const bothPasswordCheck = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;
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
      .refine(checkUsername, USERNAME_ERROR_INVALID_NAME)
      .refine(checkUniqueUsername, USERNAME_ERROR_INVALID_NAME_UNIQUE),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, EMAIL_ERROR_INVALID_EMAIL_UNIQUE),
    password: z
      .string({
        required_error: PASSWORD_ERROR_REQUIRED,
      })
      .min(PASSWORD_MIN_LENGTH)
      .trim(),
    // .regex(PASSWORD_REGEX, PASSWORD_ERROR_REGEX),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH).trim(),
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(`데이터 값 출력 완료 >>`, result.data);
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(result.data.password, 12); // 12 는 hashing 을 12번 반복한다는 의미
    console.log(`비밀번호 해싱 완료 >>`, hashedPassword);

    // 데이터베이스에 유저 정보 저장하기
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
    });

    console.log(`유저 생성 완료 >>`, user);

    // 유저 로그인
    /**
     * Iron Session 에 cookie 를 넘겨 주어야 함
     *  Next 14 에서는 cookie() 함수를 통해 간단하게 cookie 를 가져올 수 있음
     * Initial Setting 을 해주어야 함 (2번 째 args)
     * 해당 쿠키의 password 는 복호화 키 이므로 주의
     */
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // 홈으로 되돌리기
    redirect("/profile");
  }
}
