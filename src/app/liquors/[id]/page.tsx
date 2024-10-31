import LiquorInfoCardComponent from "@/components/LiquorInfoCardComponent/LiquorInfoCardComponent";
import LiquorUserTastingComponent from "@/components/LiquorUserTastingComponent/LiquorUserTastingComponent";
import {
  Box,
  Button,
  Divider,
  Fab,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import PriceInfo from "@/components/PriceInfo/PriceInfo";
import { translateWhiskyNameToJapenese } from "@/utils/translateWhiskyNameToJapenese";
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
  const userProfileNickname = liquor?.user?.profileNickname || "";

  return (
    <Stack
      sx={{
        margin: "30px 0",
        gap: "30px",
        position: "relative",
      }}
    >
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
      <Stack sx={{ gap: "40px" }}>
        {/* 이름 */}
        <Stack>
          <Stack sx={{ padding: "10px" }}>
            <Typography sx={{ color: "gray", fontSize: "10px" }}>
              {userProfileNickname === "데일리샷" || !userProfileNickname
                ? "데일리샷 정보"
                : userProfileNickname + "님이 등록한 정보"}
            </Typography>
            <Typography sx={{ fontSize: "25px", fontWeight: "700" }}>
              {liquor.koName}
            </Typography>
            <Typography sx={{ color: "gray", fontSize: "15px" }}>
              {liquor.enName}
            </Typography>
          </Stack>

          <Divider sx={{ margin: "10px 0" }} />
        </Stack>

        {/* 정보 */}
        <LiquorInfoCardComponent liquor={liquor} />
        {/* 주류 가격 정보 */}
        <PriceInfo liquorName={liquor.koName || ""} store="traders" />
        <PriceInfo liquorName={liquor.koName || ""} store="dailyshot" />
        <PriceInfo liquorName={liquor.koName || ""} store="mukawa" />
        <PriceInfo liquorName={liquor.koName || ""} store="cu" />
        <PriceInfo liquorName={liquor.koName || ""} store="getju" />
        <PriceInfo liquorName={liquor.koName || ""} store="lottemart" />
        <PriceInfo liquorName={liquor.koName || ""} store="emart" />
      </Stack>

      {/* 주류 리뷰 */}
      <Stack sx={{ marginTop: "40px" }}>
        <Stack sx={{ padding: "10px" }}>
          <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
            테이스팅 리뷰
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "gray" }}>
            다른 사용자들의 테이스팅 리뷰들을 확인해보세요.
          </Typography>
        </Stack>
        <Divider sx={{ margin: "5px 0" }} />
        <LiquorUserTastingComponent liquorId={id} />
      </Stack>

      {/* 테이스팅 리뷰 작성 버튼 */}
      <FloatingButton link={`/tasting-notes/new?liquorId=${id}`} />
    </Stack>
  );
}
