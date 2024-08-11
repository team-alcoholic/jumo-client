import { LiquorData } from "@/api/tastingNotesApi";
import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import Image from "next/image";

const getLiquorInfo = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/liquorsearch/${id}`
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("404");
    }
    throw new Error("Failed to fetch data");
  }
  const data: LiquorInfo = await res.json();
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
    <Stack sx={{ marginTop: "30px" }}>
      {/* 주류 이미지 */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={liquor.thumbnail_image_url}
          alt="주류 이미지"
          width={255}
          height={255}
        />
      </Box>

      {/* 주류 정보 */}
      <Stack sx={{ margin: "30px 0", padding: "0 30px", gap: "40px" }}>
        {/* 이름 */}
        <Stack>
          <Typography sx={{ color: "gray", fontSize: "10px" }}>
            데일리샷 정보
          </Typography>
          <Typography sx={{ fontSize: "20px" }}>{liquor.ko_name}</Typography>
          <Typography sx={{ color: "gray", fontSize: "15px" }}>
            {liquor.en_name}
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
            <Typography>{liquor.tasting_notes_Aroma}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "100px", color: "gray" }}>
              맛 (Taste)
            </Typography>
            <Typography>{liquor.tasting_notes_Taste}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Typography sx={{ minWidth: "100px", color: "gray" }}>
              여운 (Finish)
            </Typography>
            <Typography>{liquor.tasting_notes_Finish}</Typography>
          </Box>
        </Stack>

        {/* 리뷰 */}
      </Stack>
    </Stack>
  );
}
