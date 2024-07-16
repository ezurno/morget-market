"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startStream } from "./actions";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <form className="p-5 flex flex-col gap-2" action={action}>
      <Input
        name="title"
        required
        placeholder="방송 제목을 작성해 주세요."
        errors={state?.formErrors}
      />
      <Button text="스트리밍 시작하기" />
    </form>
  );
}
