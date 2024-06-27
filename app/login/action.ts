"use server";

import {
  EMAIL_ERROR_NOT_FOUND,
  PASSWORD_ERROR_REGEX,
  PASSWORD_ERROR_REQUIRED,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { updateSession } from "@/lib/sessions/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, EMAIL_ERROR_NOT_FOUND),
  password: z.string({
    required_error: PASSWORD_ERROR_REQUIRED,
  }),
  // .min(PASSWORD_MIN_LENGTH)
  // .regex(PASSWORD_REGEX, PASSWORD_ERROR_REGEX),
});

/**
 * form action 으로 동작하게 되는 함수..
 * Server Action 을 통해 onChange 와 onSubmit 이 없이 사용 가능
 *
 * @param formData Form 값에 입력 되는 form-data
 */
export async function login(prevData: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    // 이메일 찾기
    // 해당하는 이메일을 찾았을 때 비밀번호 해싱
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    /**
     * bcrypt 로 해시 값과 비밀번호를 대조해서 일치하는 지 확인
     */
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    console.log(ok);

    // 유저 로그인
    if (ok) {
      updateSession(user!.id);
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["비밀번호가 일치 하지 않습니다."],
          email: [],
        },
      };
    }
    // /profile 으로 이동
  }
}
