import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import UserTastingComponent from "../LiquorUserTastingComponent/UserTastingComponent";
import LogoutIcon from "@mui/icons-material/Logout";

/** 유저 주류 테이스팅 리뷰 목록 API 요청 함수 */
const getLiquorTastingList = async (id: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasting-notes/user/${id}`
  );
  return response.data;
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
              {10}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/*<Button*/}
      {/*  variant="contained"*/}
      {/*  color="inherit"*/}
      {/*  size="small"*/}
      {/*  startIcon={<Edit fontSize="small" />}*/}
      {/*  sx={{*/}
      {/*    margin: "5px 15px",*/}
      {/*    fontSize: "13px",*/}
      {/*    color: "gray",*/}
      {/*    backgroundColor: "#f5f5f5",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  회원 정보 수정*/}
      {/*</Button>*/}
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

      <Divider sx={{ padding: "15px 0" }} />

      <Typography
        sx={{
          paddingTop: "50px",
          fontSize: "12px",
          color: "gray",
          textAlign: "center",
        }}
      >
        내가 작성한 테이스팅 노트
      </Typography>

      {/* 사용자 활동 정보 */}
      {status == "success" &&
        (data && data.length ? (
          <UserTastingComponent data={data} />
        ) : (
          <Stack sx={{ padding: "30px 0", gap: "5px" }}>
            <Typography sx={{ color: "gray", textAlign: "center" }}>
              아직 작성된 테이스팅 리뷰가 없습니다.
            </Typography>
            <Typography sx={{ color: "gray", textAlign: "center" }}>
              가장 먼저 테이스팅 리뷰를 등록해보세요!
            </Typography>
          </Stack>
        ))}
    </Stack>
  );
}
