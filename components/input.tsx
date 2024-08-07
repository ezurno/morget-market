import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface IInputProps {
  errors?: string[];
  name: string;
}

const _Input = (
  {
    errors = [],
    name,
    ...rest
  }: IInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={ref}
        name={name}
        className="bg-transparent rounded-md w-full h-10 px-4 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-emerald-500 border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors &&
        errors?.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">
            {error}
          </span>
        ))}
    </div>
  );
};

export default forwardRef(_Input);
