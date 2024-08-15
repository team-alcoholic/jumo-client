"use client";

import UserTastingComponent from "@/components/LiquorUserTastingComponent/UserTastingComponent";
import { Edit } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
        {},
        { withCredentials: true },
      );
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`; // 로그아웃 후 메인 페이지로 이동
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
          {
            method: "GET",
            credentials: "include", // 쿠키 포함
          },
        );

        if (response.status === 401) {
          setIsLoggedIn(false);
          const redirectUrl = window.location.href;
          router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`);
        } else {
          setIsLoggedIn(true);
          setUser(await response.json());
          // console.log(await response.json());
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
        router.push("/login");
      }
    };
    setCurrentUrl(window.location.href);
    checkAuth();
  }, [router]);

  // 페이지: 로그인 여부 로딩 중
  if (isLoggedIn === null || (isLoggedIn === true && user === null)) return;

  // 페이지: 로그인 되지 않은 경우
  if (isLoggedIn === false) {
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

  // 페이지: 로그인 되어 있는 경우
  if (user) {
    return (
      <Stack sx={{ paddingTop: "10px" }}>
        {/* 사용자 프로필 */}
        <Box
          sx={{
            padding: "10px 15px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <Image
            src={user?.profileThumbnailImage || "default"}
            alt="profile image"
            width={70}
            height={70}
            style={{ borderRadius: "15px" }}
          />
          <Stack sx={{ gap: "5px" }}>
            <Typography sx={{ fontSize: "18px" }}>
              {user?.profileNickname}
            </Typography>
            <Typography sx={{ fontSize: "15px", color: "gray" }}>
              지역
            </Typography>
          </Stack>
        </Box>

        <Button
          variant="contained"
          color="inherit"
          size="small"
          startIcon={<Edit fontSize="small" />}
          sx={{
            margin: "5px 15px",
            fontSize: "13px",
            color: "gray",
            backgroundColor: "#f5f5f5",
          }}
        >
          회원 정보 수정
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={handleLogout} // 클릭 시 handleLogout 실행
          sx={{
            margin: "5px 15px",
            fontSize: "13px",
            color: "gray",
            backgroundColor: "#f5f5f5",
          }}
        >
          로그아웃
        </Button>

        <Divider sx={{ padding: "5px 0" }} />

        <Typography
          sx={{
            paddingTop: "50px",
            fontSize: "15px",
            color: "gray",
            textAlign: "center",
          }}
        >
          내가 작성한 테이스팅 노트
        </Typography>

        {/* 사용자 활동 정보 */}
        <UserTastingComponent userId={user?.userUuid} />
      </Stack>
    );
  }
}
