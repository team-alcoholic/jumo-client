"use server";

import { revalidateTag } from "next/cache";

export async function revalidateReview() {
  revalidateTag("review");
}
