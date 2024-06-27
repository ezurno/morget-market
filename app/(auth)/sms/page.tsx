"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { TOKEN_MAX_LENGTH, TOKEN_MIN_LENGTH } from "@/lib/constants";
import { smsLogIn } from "./actions";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogIn, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로 로그인하기</h1>
        <h2 className="text-xl">휴대전화 번호를 입력해주세요.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="인증 코드 입력"
            minLength={TOKEN_MIN_LENGTH}
            maxLength={TOKEN_MAX_LENGTH}
            required
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="전화 번호 입력"
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button
          text={state.token ? "토큰 인증하기" : "SMS 로 인증코드 보내기"}
        />
      </form>
    </div>
  );
}
