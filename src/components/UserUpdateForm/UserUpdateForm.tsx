"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function UserUpdateForm() {
  const pathName = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>(); // 응답받은 user 객체 관리
  const [nickname, setNickname] = useState(""); // 이름
  const [profileImage, setProfileImage] = useState(""); // 이미지: 직접 업로드
  const [defaultImage, setDefaultImage] = useState(""); // 이미지: 기본 이미지

  /** 초기 사용자 정보 요청 api */
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users`,
        { withCredentials: true }
      );
      setUser(response.data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_BAD_REQUEST") {
        router.push("/login");
      } else console.error(err);
    }
  };

  /** 사용자 정보 수정 요청 api -> 이전 경로로 리다이렉트 */
  const updateUserInfo = async () => {
    if (user) {
      const formData = new FormData();
      formData.append("userUuid", user.userUuid);
      formData.append("profileNickname", nickname);
      if (defaultImage) formData.append("defaultImage", defaultImage);

      // 호출 경로에 따라 동작 구분 (회원가입 시 정보 입력 or 회원 정보 수정)
      try {
        switch (pathName) {
          // 회원 가입 정보 입력 시
          case "/join":
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            );
            const redirectUrl = response.data;
            router.push(redirectUrl);

          // 회원 정보 수정 시
          case "/mypage/edit":
            console.log(user);
            await axios.put(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            );
            router.push("/mypage");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === "ERR_BAD_REQUEST") {
          router.push("/login");
        } else console.error(err);
      }
    }
  };

  /** 사용자 정보 변경 취소 */
  const handleCancle = () => {
    router.push("/mypage");
  };

  /** 랜덤 프로필 이미지 요청 api */
  const getRandomImage = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users/random-image`
    );
    setDefaultImage(response.data);
  };

  /** 랜덤 사용자 이름 요청 api */
  const getRandomNickname = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users/random-name`
    );
    setNickname(response.data);
  };

  useEffect(() => {
    const init = async () => {
      const user: User = await getUserInfo();
      if (user) setNickname(user.profileNickname ? user.profileNickname : "");
      if (user)
        setProfileImage(
          user.profileThumbnailImage ? user.profileThumbnailImage : ""
        );
    };

    init();
  }, []);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    user && (
      <Stack
        sx={{ alignItems: "center", gap: "60px", justifyContent: "center" }}
      >
        {/* 이미지 설정 */}
        <Stack
          sx={{
            width: "80%",
            gap: "15px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: "600" }}
            >
              프로필 사진
            </Typography>
            <Button size="small" variant="contained" onClick={getRandomImage}>
              자동생성
            </Button>
          </Box>
          <Image
            src={defaultImage ? defaultImage : profileImage}
            alt="profile image"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "1/1",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "5px",
            }}
          />
        </Stack>

        {/* 이름 설정 */}
        <Stack
          sx={{
            width: "80%",
            gap: "15px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: "600" }}
            >
              이름
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={getRandomNickname}
            >
              자동생성
            </Button>
          </Box>
          <TextField
            variant="standard"
            value={nickname}
            onChange={handleNicknameChange}
            sx={{ width: "100%" }}
          />
        </Stack>

        {/* 버튼 그룹 */}
        <Stack sx={{ gap: "10px", width: "80%" }}>
          <Button
            onClick={updateUserInfo}
            size="small"
            variant="contained"
            sx={{ width: "100%" }}
          >
            완료
          </Button>
          <Button
            onClick={handleCancle}
            size="small"
            variant="contained"
            sx={{ width: "100%" }}
          >
            취소
          </Button>
        </Stack>
      </Stack>
    )
  );
}
