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
  const [profileImage, setProfileImage] = useState(""); // 이미지

  /** 초기 사용자 정보 요청 api */
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
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
      user.profileNickname = nickname;
      user.profileImage = profileImage;
      user.profileThumbnailImage = profileImage;

      // 호출 경로에 따라 동작 구분 (회원가입 시 정보 입력 or 회원 정보 수정)
      try {
        switch (pathName) {
          // 회원 가입 정보 입력 시
          case "/join":
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
              user,
              { withCredentials: true }
            );
            const redirectUrl = response.data;
            router.push(redirectUrl);
          // 회원 정보 수정 시
          case "/mypage/edit":
            await axios.put(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
              user,
              { withCredentials: true }
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

  /** 랜덤 프로필 이미지 요청 api */
  const getRandomImage = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/random-image`
    );
    setProfileImage(response.data);
  };

  /** 랜덤 사용자 이름 요청 api */
  const getRandomNickname = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/random-name`
    );
    setNickname(response.data);
  };

  useEffect(() => {
    const init = async () => {
      const user = await getUserInfo();
      if (user) setNickname(user.profileNickname ? user.profileNickname : "");
      if (user) setProfileImage(user.profileImage ? user.profileImage : "");
    };

    init();
  }, []);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    user && (
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", gap: "20px" }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>프로필 사진</Typography>
          <Button size="small" variant="contained" onClick={getRandomImage}>
            변경
          </Button>
        </Box>
        <Image
          src={profileImage}
          alt="profile image"
          width={255}
          height={255}
          // onChange={handleImageChange}
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>이름</Typography>
          <Button size="small" variant="contained" onClick={getRandomNickname}>
            자동생성
          </Button>
        </Box>
        <TextField
          variant="standard"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <Button onClick={updateUserInfo} size="small" variant="contained">
          완료
        </Button>
      </Stack>
    )
  );
}
