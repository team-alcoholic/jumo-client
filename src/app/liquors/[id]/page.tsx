import { LiquorData } from "@/api/tastingNotesApi";
import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import Image from "next/image";

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
  console.log(data);
  return data;
};

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
      <Stack sx={{ gap: "40px" }}>
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
        <Stack sx={{ gap: "8px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
            주류 정보
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "35px", color: "gray" }}>
              분류
            </Typography>
            <Typography>{liquor.type}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "35px", color: "gray" }}>
              도수
            </Typography>
            <Typography>{liquor.abv}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "35px", color: "gray" }}>
              국가
            </Typography>
            <Typography>{liquor.country}</Typography>
          </Box>
        </Stack>

        {/* 테이스팅 노트 */}
        <Stack sx={{ gap: "8px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
            테이스팅 정보
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "100px", color: "gray" }}>
              향 (Aroma)
            </Typography>
            <Typography>{liquor.tastingNotesAroma}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "100px", color: "gray" }}>
              맛 (Taste)
            </Typography>
            <Typography>{liquor.tastingNotesTaste}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "100px", color: "gray" }}>
              여운 (Finish)
            </Typography>
            <Typography>{liquor.tastingNotesFinish}</Typography>
          </Box>
        </Stack>
      </Stack>

      {/* 주류 리뷰 */}
      <Stack sx={{ marginTop: "50px" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
          커뮤니티 리뷰
        </Typography>
        <Divider sx={{ margin: "5px 0" }} />
      </Stack>
    </Stack>
  );
}
