"use client";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function HeaderComponent() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const threshold = 50; // 헤더가 나타나기 위한 스크롤 임계값

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY + threshold) {
      setIsVisible(false); // 스크롤을 많이 내리면 헤더 숨기기
    } else if (lastScrollY - currentScrollY > threshold) {
      setIsVisible(true); // 스크롤을 많이 올리면 헤더 보이기
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, lastScrollY]);

  const pathName = usePathname();

  // 네비게이션 바를 숨길 경로 패턴
  const hideNavPaths = [
    "/tasting-notes/new",
    /^\/tasting-notes\/\d+\/edit$/, // 동적 ID를 포함한 edit 경로
  ];

  // 현재 경로가 숨길 경로 중 하나와 일치하면 네비게이션 바를 렌더링하지 않음
  if (
    hideNavPaths.some((path) =>
      typeof path === "string" ? pathName === path : path.test(pathName),
    )
  ) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          position: "fixed",
          top: isVisible ? 0 : "-80px", // 스크롤 방향에 따라 헤더 위치 변경
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderBottom: "1px solid #D9D9D9",
          boxShadow: "0 2px 1px -1px gray",
          zIndex: 1000,
          transition: "top 0.3s", // 애니메이션 추가
        }}
        style={{ backgroundColor: "white" }}
      >
        <Typography variant="h5">JUMO</Typography>
      </Box>
      <div style={{ width: "100%", height: "80px" }}></div>
    </div>
  );
}
