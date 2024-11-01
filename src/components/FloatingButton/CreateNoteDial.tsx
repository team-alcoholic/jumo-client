"use client";

import { ShoppingCartOutlined, WineBarOutlined } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateNoteDialProps {
  liquorId?: number;
  offset: boolean;
}

export default function CreateNoteDial(props: CreateNoteDialProps) {
  // 노트 작성 다이얼 옵션
  const [dialOpen, setDialOpen] = useState(false);
  // 다이얼 상태 변경 함수
  const handleDialOpen = () => {
    setDialOpen(true);
  };
  const handleDialClose = () => {
    setDialOpen(false);
  };
  const router = useRouter();
  const { liquorId, offset } = props;

  /** 노트 작성 다이얼 옵션 */
  const dialAction = [
    {
      icon: <WineBarOutlined />,
      name: "마셨어요",
      onClick: () => {
        if (liquorId) router.push(`/tasting-notes/new?liquorId=${liquorId}`);
        else router.push(`/tasting-notes/new`);
      },
    },
    {
      icon: <ShoppingCartOutlined />,
      name: "구매했어요",
      onClick: () => {
        if (liquorId) router.push(`/purchase-notes/new?liquorId=${liquorId}`);
        else router.push(`/purchase-notes/new`);
      },
    },
  ];

  return (
    <SpeedDial
      sx={{
        position: "fixed",
        bottom: offset ? 72 : 12,
        right: 12,
        "& .MuiSpeedDial-fab": {
          // 메인 버튼 설정
          width: 45,
          height: 45,
        },
      }}
      icon={<SpeedDialIcon />}
      onClose={handleDialClose}
      onOpen={handleDialOpen}
      open={dialOpen}
      ariaLabel="dial"
    >
      {dialAction.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
}
