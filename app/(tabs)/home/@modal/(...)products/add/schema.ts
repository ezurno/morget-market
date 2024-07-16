import {
  PHOTO_ERROR_REQUIRED,
  TITLE_ERROR_REQUIRED,
  DESCRIPTION_ERROR_REQUIRED,
  PRICE_ERROR_REQUIRED,
  PRICE_ERROR_INVALID_TYPE,
} from "@/lib/constants";
import { z } from "zod";

export const productSchema = z.object({
  id: z.coerce.number().optional(),
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
    invalid_type_error: PRICE_ERROR_INVALID_TYPE,
  }),
});

// infer 를 통해 zod 의 타입을 확인 할 수 있음
export type ProductType = z.infer<typeof productSchema>;
