"use client";

import { useFormStatus } from "react-dom";

interface IButtonProps {
  text: string;
}

export default function Button({ text }: IButtonProps) {
  /**
   * useFormStatus 는 현재 form 의 상태를 알 수 있는 React 내장함수
   * pending 은 해당 함수가 종료되었는지 여부를 알 수 있음
   */
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "로딩 중" : text}
    </button>
  );
}
