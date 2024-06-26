"use server";

import {
  PASSWORD_ERROR_REGEX,
  PASSWORD_ERROR_REQUIRED,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: PASSWORD_ERROR_REQUIRED,
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_ERROR_REGEX),
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
  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
