"use client";

import { useState } from "react";
import { onDelete } from "../app/(tabs)/home/@modal/(...)home/[id]/actions";

export default function DeleteButton({
  id,
  isOwner,
}: {
  id: number;
  isOwner: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 버튼을 클릭 할 시 삭제 여부를 물어봄
   */
  const onClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    setIsLoading(true);
    await onDelete(id, isOwner);
    setIsLoading(false);

    window.location.href = "/home";
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="bg-red-500 w-full h-10 rounded-md font-semibold"
    >
      {isLoading ? "삭제 하는 중..." : "삭제하기"}
    </button>
  );
}
