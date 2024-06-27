"use client";

import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import Button from "@/components/button";
import Input from "@/components/input";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { login } from "./action";

export default function LogIn() {
  /**
   * useFormState 는 action args 를 받아서 검수를 함
   * useState 와 매우 비슷하며 초기 값을 설정 해주어야 함
   */
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">로그인 정보를 입력하세요.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="로그인 하기" />
      </form>
      <SocialLogin />
    </div>
  );
}
