"use server";

import {
  DESCRIPTION_ERROR_REQUIRED,
  PHOTO_ERROR_REQUIRED,
  PRICE_ERROR_REQUIRED,
  TITLE_ERROR_REQUIRED,
} from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  photo: z.string({
    required_error: PHOTO_ERROR_REQUIRED,
  }),
  title: z.string({
    required_error: TITLE_ERROR_REQUIRED,
  }),
  description: z.string({
    required_error: DESCRIPTION_ERROR_REQUIRED,
  }),
  price: z.coerce.number({
    required_error: PRICE_ERROR_REQUIRED,
  }),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (data.photo instanceof File) {
    // 확장자 명이 File 일 때
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;

    const result = productSchema.safeParse(data);
    if (!result.success) {
      return result.error.flatten();
    } else {
      const session = await getSession();
      if (session.id) {
        const product = await db.product.create({
          data: {
            title: result.data.title,
            description: result.data.description,
            price: result.data.price,
            photo: result.data.photo,
            user: {
              connect: {
                id: session.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        redirect(`/products/${product.id}`);
      }
    }
  }

  console.log(data);
}
