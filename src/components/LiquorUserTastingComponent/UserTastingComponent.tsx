// 지정된 유저가 작성한 모든 주류 테이스팅 리뷰 목록 보여주는 컴포넌트

"use client";

import { calculateAverageScore, formatDateTime } from "@/utils/format";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import Link from "next/link";
import SingleTastingComponent from "../SingleTastingComponent/SingleTastingComponent";

/** 유저 주류 테이스팅 리뷰 목록 API 요청 함수 */
const getLiquorTastingList = async (id: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasting-notes/user/${id}`,
  );
  console.log(response.data);
  return response.data;
};

export default function UserTastingComponent({ userId }: { userId: string }) {
  // 주류 검색 api query
  const { data, status } = useQuery({
    queryKey: ["userTastingList", userId],
    queryFn: () => getLiquorTastingList(userId),
  });

  return (
    <Stack sx={{ marginBottom: "10px", padding: "20px 0", gap: "15px" }}>
      {status == "success" &&
        (data && data.length ? (
          data.map((tasting: TastingNoteList) => (
            <Link
              key={tasting.id}
              href={`/tasting-notes/${tasting.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Stack
                sx={{
                  border: "solid 1px #dddddd",
                  borderRadius: "5px 5px",
                  padding: "15px 20px",
                  gap: "15px",
                }}
              >
                {/* 카드 헤더 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {/* 주류 및 작성 정보 */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <Image
                      src={tasting.liquor.thumbnailImageUrl || "default"}
                      width={40}
                      height={40}
                      alt="user profile image"
                      style={{ borderRadius: "15px" }}
                    />
                    <Stack sx={{ justifyContent: "center" }}>
                      <Typography sx={{ fontWeight: "500" }}>
                        {tasting.liquor.koName}
                      </Typography>
                      <Typography sx={{ color: "gray", fontSize: "13px" }}>
                        {formatDateTime(tasting.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>
                  {/* 작성자 총점 */}
                  <Box
                    sx={{
                      paddingRight: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {calculateAverageScore(
                      tasting.noseScore,
                      tasting.palateScore,
                      tasting.finishScore,
                    ) && (
                      <Chip
                        label={calculateAverageScore(
                          tasting.noseScore,
                          tasting.palateScore,
                          tasting.finishScore,
                        )}
                      />
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* 테이스팅 리뷰 내용: 상세 */}
                <Stack sx={{ gap: "5px" }}>
                  <SingleTastingComponent
                    keyContent="Nose"
                    valueContent={tasting.noseNotes}
                    detailContent={tasting.noseMemo}
                    keyMinWidth={50}
                  />
                  <SingleTastingComponent
                    keyContent="Palate"
                    valueContent={tasting.palateNotes}
                    detailContent={tasting.palateMemo}
                    keyMinWidth={50}
                  />
                  <SingleTastingComponent
                    keyContent="Finish"
                    valueContent={tasting.finishNotes}
                    detailContent={tasting.finishMemo}
                    keyMinWidth={50}
                  />
                </Stack>

                {/* 테이스팅 리뷰 내용: 총평 */}
                <Stack>
                  <Typography
                    sx={{
                      // overflow: "hidden",
                      // whiteSpace: "nowrap",
                      // textOverflow: "ellipsis",
                      fontSize: "15px",
                    }}
                  >
                    &nbsp;{tasting.overallNote}
                  </Typography>
                </Stack>
              </Stack>
            </Link>
          ))
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
