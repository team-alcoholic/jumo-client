import LiquorInfoCardComponent from "@/components/LiquorInfoCardComponent/LiquorInfoCardComponent";
import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import Image from "next/image";

/** 주류 상세정보 API 요청 함수 */
const getLiquorInfo = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/liquors/${id}`
  );
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("404");
    }
    throw new Error("Failed to fetch data");
  }
  const data: LiquorData = await res.json();
  return data;
};

/** 주류 정보 */

export default async function LiquorDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // 주류 데이터
  const liquor = await getLiquorInfo(id);

  return (
    <Stack sx={{ marginTop: "30px", padding: "0 30px", gap: "30px" }}>
      {/* 주류 이미지 */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={liquor.thumbnailImageUrl ? liquor.thumbnailImageUrl : "default"}
          alt="주류 이미지"
          width={255}
          height={255}
        />
      </Box>

      {/* 주류 정보 */}
      <Stack sx={{ gap: "50px" }}>
        {/* 이름 */}
        <Stack>
          <Typography sx={{ color: "gray", fontSize: "10px" }}>
            데일리샷 정보
          </Typography>
          <Typography sx={{ fontSize: "25px", fontWeight: "700" }}>
            {liquor.koName}
          </Typography>
          <Typography sx={{ color: "gray", fontSize: "15px" }}>
            {liquor.enName}
          </Typography>
          <Divider sx={{ margin: "10px 0" }} />
        </Stack>

        {/* 정보 */}
        <LiquorInfoCardComponent liquor={liquor} />
      </Stack>

      {/* 주류 리뷰: 컴포넌트 구현 필요 */}
      <Stack sx={{ marginTop: "50px" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
          커뮤니티 리뷰
        </Typography>
        <Divider sx={{ margin: "5px 0" }} />
      </Stack>
    </Stack>
  );
}
