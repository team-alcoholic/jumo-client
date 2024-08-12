"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [info, setInfo] = useState("");
  const tastingNotesInfo =
    "테이스팅 노트 작성을 기록하기 위해서는 로그인이 필요합니다 ㅠㅠ";

  useEffect(() => {
    const redirectUrl = params.get("redirectTo") || "/";
    if (redirectUrl.includes("tasting-notes")) {
      setInfo(tastingNotesInfo);
    }
  }, [params]);

  const handleKakaoLogin = () => {
    const redirectUrl = params.get("redirectTo") || "/";
    router.push(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao?redirectTo=${encodeURIComponent(redirectUrl)}`,
    );
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          주모에 오신 것을 환영합니다!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          간단하게 로그인하고 다양한 서비스를 즐겨보세요.
        </Typography>
        {info && (
          <Typography variant="body1" color="textSecondary">
            {info}
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, backgroundColor: "#FEE500", color: "#000" }}
        onClick={handleKakaoLogin}
      >
        카카오로 1초 로그인하기
      </Button>
    </Container>
  );
}
