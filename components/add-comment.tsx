"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IAddCommentProps {
  postId: number;
  handleSubmit: (payload: string, postId: number) => Promise<void>;
  user: { id: number; avatar: string | null; username: string } | null;
}

interface IFormInput {
  payload: string;
}

export function AddComment({ postId, handleSubmit, user }: IAddCommentProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit: formSubmit,
    resetField,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    resetField("payload");
    setLoading(true);
    await handleSubmit(data.payload, postId);
    setLoading(false);
  };

  return (
    <div className="w-full h-16 relative bottom-0 px-5 border-t border-neutral-600">
      <form
        className="flex space-x-4 justify-around items-center size-full"
        onSubmit={formSubmit(onSubmit)}
      >
        <input
          placeholder={
            user
              ? "여기에 댓글을 달아보세요!"
              : "댓글을 달기 위해서는 로그인을 해주세요!"
          }
          className="w-11/12 h-12 bg-transparent rounded-full focus:outline-none outline-offset-2"
          {...register("payload", { required: true })}
          disabled={!user || loading}
        />
        {user && (
          <button
            className="text-emerald-500 hover:text-emerald-400 active:text-emerald-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:animate-pulse"
            type="submit"
            disabled={loading}
          >
            <PaperAirplaneIcon className="size-8" />
          </button>
        )}
      </form>
      {errors.payload && (
        <p className="text-red-500 text-sm mt-2">댓글을 입력해 주세요.</p>
      )}
    </div>
  );
}

export default AddComment;
