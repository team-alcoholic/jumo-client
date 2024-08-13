"use client";

import { Fab, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

export default function FloatingButton({ link }: { link: string }) {
  // const [rightOffset, setRightOffset] = useState(0);

  // useEffect(() => {
  //   const updatePosition = () => {
  //     const viewportWidth = window.innerWidth;
  //     if (viewportWidth <= 600) {
  //       setRightOffset(0); // 뷰포트에 고정
  //     } else {
  //       setRightOffset((viewportWidth - 600) / 2); // 부모 요소 내부에 고정되도록 조정
  //     }
  //   };

  //   updatePosition(); // 초기 위치 설정
  //   window.addEventListener("resize", updatePosition); // 윈도우 크기 변경 시 위치 업데이트

  //   return () => window.removeEventListener("resize", updatePosition);
  // }, []);

  return (
    <Link
      href={link}
      style={{
        color: "inherit",
        textDecoration: "none",
        position: "fixed",
        zIndex: 1000,
        transform: "translateX(-50%)",
        left: "50%",
        bottom: `${80 + 15}px`,
      }}
    >
      <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
        <Fab
          variant="extended"
          size="small"
          color="info"
          sx={{ padding: "0 12px" }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography sx={{ fontSize: "12px" }}>리뷰 작성하기</Typography>
        </Fab>
      </Stack>
    </Link>
  );
}
