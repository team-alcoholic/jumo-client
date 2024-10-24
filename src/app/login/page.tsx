"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

function LoginComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const [info, setInfo] = useState("");
  const tastingNotesInfo =
    "테이스팅 노트 작성을 기록하기 위해서는 로그인이 필요합니다.";

  useEffect(() => {
    const redirectUrl = params.get("redirectTo");
    if (redirectUrl && redirectUrl.includes("tasting-notes")) {
      setInfo(tastingNotesInfo);
    }
  }, [params]);

  const handleKakaoLogin = () => {
    const redirectUrl = params.get("redirectTo");
    router.push(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/oauth2/authorization/kakao${redirectUrl ? `?redirectTo=${encodeURIComponent(redirectUrl)}` : ""}`
    );
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 4 }}>
        {info && (
          <Typography variant="h3" component="h1" gutterBottom>
            거의 다 왔어요!
          </Typography>
        )}
        <Typography variant="h5" component="h1" gutterBottom>
          주모에 오신 것을 환영합니다!
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: "14px" }}>
          간편하게 로그인하고 다양한 서비스를 즐겨보세요.
        </Typography>

        {info && (
          <Typography color="textSecondary" sx={{ fontSize: "14px" }}>
            {info}
          </Typography>
        )}
      </Box>
      <Box
        onClick={handleKakaoLogin}
        sx={{
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
          transition: "opacity 0.3s",
        }}
      >
        <Image
          src="/kakao_login_large_wide.png"
          alt="카카오 로그인"
          width={300}
          height={45}
        />
      </Box>
      <Typography color="textSecondary" sx={{ fontSize: "14px" }}>
        회원 가입/ 로그인 원터치 통합 버튼
      </Typography>
      <Typography color="textSecondary" sx={{ fontSize: "14px" }}>
        (추가 입력 필요X)
      </Typography>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  );
}
