"use server";

import { redirect } from "next/navigation";

/**
 * form action 으로 동작하게 되는 함수..
 * Server Action 을 통해 onChange 와 onSubmit 이 없이 사용 가능
 *
 * @param formData Form 값에 입력 되는 form-data
 */
export async function handleForm(prevData: any, formData: FormData) {
  "use server"; // 서버에서만 동작하는 함수라고 지정
  console.log(formData.get("email"), formData.get("password"));
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    errors: ["WRONG PASSWORD", "PASSWORD TOO SHORT"],
  };
}
