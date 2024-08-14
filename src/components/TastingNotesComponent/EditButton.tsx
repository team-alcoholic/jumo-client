"use client";

import React, { useEffect, useState } from "react";
import { SaveButton } from "@/app/tasting-notes/new/StyledComponent";
// import { useRouter } from "next/router";
interface EditButtonProps {
  user: User;
}
const EditButton: React.FC<EditButtonProps> = ({ user }) => {
  const [canEdit, setCanEdit] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    // 클라이언트 측에서만 실행
    setIsClient(true);

    if (isClient) {
      const checkUserPermission = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
            {
              method: "GET",
              credentials: "include", // 세션 기반 인증에 필요한 경우 추가
            },
          );
          const fetchedUser = await response.json();
          if (fetchedUser.userUuid === user.userUuid) {
            setCanEdit(true);
          }
        } catch (error) {
          console.error("Error fetching auth data:", error);
        }
      };

      checkUserPermission();
    }
  }, [user, isClient]);

  if (!isClient || !canEdit) {
    return null;
  }

  return (
    <SaveButton onClick={() => alert("수정하기 기능 구현 필요")}>
      테이스팅 노트 수정하기
    </SaveButton>
  );
};

export default EditButton;
