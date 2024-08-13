"use client";

import { formatDateTime } from "@/utils/format";
import { Box, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import KeyValueInfoComponent from "../KeyValueInfoComponent/KeyValueInfoComponent";
import Link from "next/link";

/** 주류 유저 테이스팅 리뷰 목록 API 요청 함수 */
const getLiquorTastingList = async (id: number) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasting-notes/liquor/${id}`
  );
  console.log(response.data);
  return response.data;
};

export default function LiquorUserTastingComponent({
  liquorId,
}: {
  liquorId: string;
}) {
  // 주류 검색 api query
  const { data, status } = useQuery({
    queryKey: ["liquorTastingList", liquorId],
    queryFn: () => getLiquorTastingList(+liquorId),
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
                  padding: "15px 25px",
                  gap: "15px",
                }}
              >
                {/* 작성자 정보 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <Image
                    src={tasting.user.profileThumbnailImage || "default"}
                    width={40}
                    height={40}
                    alt="user profile image"
                    style={{ borderRadius: "15px" }}
                  />
                  <Stack sx={{ justifyContent: "center" }}>
                    <Typography sx={{ fontWeight: "500" }}>
                      {tasting.user.profileNickname}
                    </Typography>
                    <Typography sx={{ color: "gray", fontSize: "13px" }}>
                      {formatDateTime(tasting.createdAt)}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                {/* 테이스팅 리뷰 내용: 상세 */}
                <Stack>
                  <KeyValueInfoComponent
                    keyContent="Nose"
                    valueContent={tasting.noseMemo}
                    keyMinWidth={65}
                  />
                  <KeyValueInfoComponent
                    keyContent="Palate"
                    valueContent={tasting.palateMemo}
                    keyMinWidth={65}
                  />
                  <KeyValueInfoComponent
                    keyContent="Finish"
                    valueContent={tasting.finishMemo}
                    keyMinWidth={65}
                  />
                </Stack>
                {/* 테이스팅 리뷰 내용: 총평 */}
                <Stack>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tasting.overallNote}
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
