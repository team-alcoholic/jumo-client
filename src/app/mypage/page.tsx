"use client";

import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
          {
            method: "GET",
            credentials: "include", // 쿠키 포함
          }
        );

        if (response.status === 401) {
          setIsLoggedIn(false);
          // router.push('/login'); // 로그인되지 않았을 경우 로그인 페이지로 리다이렉트
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
        // router.push('/login');
      }
    };
    setCurrentUrl(window.location.href);
    checkAuth();
  }, [router]);

  if (isLoggedIn === null) {
    return;
  } else if (isLoggedIn === false) {
    return (
      <Stack
        sx={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Typography sx={{ color: "gray", fontSize: "15px" }}>
          로그인이 필요합니다.
        </Typography>
        <Link href={`/login?redirectTo=${encodeURIComponent(currentUrl)}`}>
          <Button variant="outlined">로그인</Button>
        </Link>
      </Stack>
    );
  }

  return <h1>you are logged in</h1>;
}
