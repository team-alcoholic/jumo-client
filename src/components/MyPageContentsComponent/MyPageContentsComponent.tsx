"use client";

import {
  Box,
  Button,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import UserTastingComponent from "../LiquorUserTastingComponent/UserTastingComponent";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { Edit } from "@mui/icons-material";
import UserNoteGroupComponent from "../LiquorUserTastingComponent/UserNoteGroupComponent";

/** 유저 주류 테이스팅 리뷰 목록 API 요청 함수 */
const getLiquorTastingList = async (id: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasting-notes/user/${id}`
  );
  const list: TastingNoteList[] = response.data;

  // 그룹화 로직
  const groupMap = new Map<string, UserNoteGroup>();
  list.forEach((note) => {
    const liquorId = note.liquor.id.toString(); // liquor의 고유 식별자로 가정
    if (groupMap.has(liquorId)) {
      groupMap.get(liquorId)!.notesCount++;
    } else {
      groupMap.set(liquorId, { liquor: note.liquor, notesCount: 1 });
    }
  });

  const group: UserNoteGroup[] = Array.from(groupMap.values());

  return { list, group };
};

/** 로그아웃 API 요청 함수 */
const handleLogout = async () => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`; // 로그아웃 후 메인 페이지로 이동
  } catch (error) {
    console.error("Error logging out", error);
  }
};

export default function MyPageContentsComponent({ user }: { user: User }) {
  // 사용자 작성 노트 탭 state
  const [noteTabOption, setNoteTabOption] = useState("group");
  const handleNoteTabOptionChange = (
    e: React.SyntheticEvent,
    value: string
  ) => {
    setNoteTabOption(value);
  };

  // 주류 검색 api query
  const { data, status } = useQuery({
    queryKey: ["userTastingList", user.userUuid],
    queryFn: () => getLiquorTastingList(user.userUuid),
  });

  return (
    <Stack>
      {/* 사용자 프로필 */}
      <Box
        sx={{
          padding: "10px 15px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Image
          src={user?.profileThumbnailImage || "default"}
          alt="profile image"
          width={60}
          height={60}
          style={{ borderRadius: "15px" }}
        />
        <Stack sx={{ gap: "5px" }}>
          <Typography sx={{ fontSize: "15px" }}>
            {user?.profileNickname}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography sx={{ fontSize: "12px" }}>작성한 노트 수</Typography>
            <Typography sx={{ fontSize: "12px", color: "gray" }}>
              {data &&
                data.group.reduce((acc, item) => acc + item.notesCount, 0)}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // gap: "2px",
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          size="small"
          startIcon={<Edit fontSize="small" />}
          sx={{
            margin: "5px 10px",
            width: "100%",
            fontSize: "10px",
            color: "gray",
            backgroundColor: "#f5f5f5",
          }}
          href="/mypage/edit"
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
            margin: "5px 10px",
            width: "100%",
            fontSize: "10px",
            color: "gray",
            backgroundColor: "#f5f5f5",
          }}
        >
          로그아웃
        </Button>
      </Box>

      {/* 사용자 작성 노트 보기 옵션 탭 */}
      <Box
        sx={{
          borderBottom: 1,
          paddingTop: "20px",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={noteTabOption}
          onChange={handleNoteTabOptionChange}
          variant="fullWidth"
          // centered
        >
          <Tab value="group" label="주류" />
          <Tab value="list" label="피드" />
        </Tabs>
      </Box>

      {/* 사용자 활동 정보 */}
      {status == "success" &&
        (data.list.length && data.group.length ? (
          <>
            {noteTabOption === "group" && (
              <UserNoteGroupComponent data={data.group} />
            )}
            {noteTabOption === "list" && (
              <UserTastingComponent data={data.list} />
            )}
          </>
        ) : (
          <Stack sx={{ padding: "30px 0", gap: "5px" }}>
            <Typography sx={{ color: "gray", textAlign: "center" }}>
              아직 작성된 테이스팅 노트가 없습니다.
            </Typography>
            <Typography sx={{ color: "gray", textAlign: "center" }}>
              먼저 테이스팅 노트를 작성해보세요!
            </Typography>
          </Stack>
        ))}
    </Stack>
  );
}
