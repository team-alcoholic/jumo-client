"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TastingNotesEditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    alert("주모 공사중입니다.");
    router.back();
  });

  return null;
}
