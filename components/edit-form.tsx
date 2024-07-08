"use client";

import { deletePhoto, editProduct } from "@/app/products/[id]/edit/actions";
import { getUploadUrl } from "@/app/products/add/actions";
import { productSchema, ProductType } from "@/app/products/add/schema";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./input";
import Button from "./button";
import DeleteButton from "./delete-button";

const IMAGEDELIVERY_URL = "https://imagedelivery.net/VgnS9oc7uEZr48wa5MuWXg/";

export default function EditForm({
  id,
  product,
  isOwner,
}: {
  id: number;
  product: ProductType;
  isOwner: boolean;
}) {
  const [preview, setPreview] = useState(`${product.photo}/public`);
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file && !preview) return;
    if (file) {
      const photoId = product.photo.split(
        `${process.env.IMAGEDELIVERY_URL}`
      )[1];
      await deletePhoto(photoId);
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });
      if (response.status !== 200) {
        return alert("이미지 업로드에 실패하였습니다.");
      }
    }

    const formData = new FormData();
    formData.append("id", id + "");
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price + "");
    console.log(data);
    formData.append("photo", data.photo);
    const errors = await editProduct(formData);
    if (errors) {
      if (errors.fieldErrors.photo) {
        setError("photo", { message: errors.fieldErrors.photo[0] });
      }
      if (errors.fieldErrors.title) {
        setError("title", { message: errors.fieldErrors.title[0] });
      }
      if (errors.fieldErrors.price) {
        setError("price", { message: errors.fieldErrors.price[0] });
      }
      if (errors.fieldErrors.description) {
        setError("description", { message: errors.fieldErrors.description[0] });
      }
    }
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    if (files.length !== 1)
      return alert("파일은 한개만 업로드 할 수 있습니다.");
    const MB = 1024 * 1024;
    if (files[0].size > 5 * MB)
      return alert("업로드 할 수 있는 파일의 최대 크기는 5MB 입니다.");
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue("photo", `${IMAGEDELIVERY_URL}${id}`);
    }
  };

  const onValid = async () => {
    await onSubmit();
  };

  useEffect(() => {
    const photoId = product.photo.split(`${process.env.IMAGEDELIVERY_URL}`)[1];
    setValue("photo", `${IMAGEDELIVERY_URL}${photoId}`);
  }, [product, setValue]);

  return (
    <form action={onValid} className="p-5 flex flex-col gap-3">
      <label
        htmlFor="photo"
        className="border-2 aspect-square flex flex-col items-center justify-center gap-3 text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
        style={{
          backgroundImage: `url(${preview})`,
        }}
      >
        {preview === "" ? (
          <>
            <PhotoIcon className="size-20" />
            <div className="text-sm text-neutral-400">
              사진을 추가해 주세요.
            </div>
          </>
        ) : null}
      </label>
      {
        <span className="text-red-500 font-medium">
          {errors.photo?.message}
        </span>
      }
      <input
        type="file"
        id="photo"
        name="photo"
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
      <Input
        required
        placeholder="제목"
        defaultValue={product.title}
        type="text"
        errors={[errors.title?.message ?? ""]}
        {...register("title")}
      />
      <Input
        required
        placeholder="가격"
        defaultValue={product.price}
        type="number"
        errors={[errors.price?.message ?? ""]}
        {...register("price")}
      />
      <Input
        required
        placeholder="자세한 설명"
        defaultValue={product.description}
        type="text"
        errors={[errors.description?.message ?? ""]}
        {...register("description")}
      />
      <Button text="수정하기" />
      <DeleteButton id={id} isOwner={isOwner} />
    </form>
  );
}
