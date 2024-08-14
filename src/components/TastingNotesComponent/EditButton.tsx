"use client";

import React, { useEffect, useState } from "react";
import { SaveButton } from "@/app/tasting-notes/new/StyledComponent";
import { usePathname, useRouter } from "next/navigation";
import { checkUserPermission } from "@/api/tastingNotesApi";

interface EditButtonProps {
  user: User;
}

const EditButton: React.FC<EditButtonProps> = ({ user }) => {
  const [canEdit, setCanEdit] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = () => {
    router.push(`${pathname}/edit`);
  };

  useEffect(() => {
    setIsClient(true);

    const checkPermission = async () => {
      if (isClient) {
        const permission = await checkUserPermission(user);
        setCanEdit(permission);
      }
    };

    checkPermission();
  }, [user, isClient]);

  if (!isClient || !canEdit) {
    return null;
  }

  return <SaveButton onClick={handleEdit}>테이스팅 노트 수정하기</SaveButton>;
};

export default EditButton;
