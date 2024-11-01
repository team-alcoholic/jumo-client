// 지정된 주류에 해당하는 모든 유저들의 테이스팅 리뷰 목록 보여주는 컴포넌트

"use client";

import { calculateAverageScore, formatDateTime } from "@/utils/format";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import Link from "next/link";
import SingleTastingComponent from "../SingleTastingComponent/SingleTastingComponent";
import TastingNoteCard from "../NoteCard/TastingNoteCard";

/** 주류 유저 테이스팅 리뷰 목록 API 요청 함수 */
const getLiquorTastingList = async (id: number) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes/liquor/${id}`
  );
  return response.data;
};

export default function LiquorUserTastingComponent({
  liquorId,
}: {
  liquorId: string;
}) {
  // 주류 검색 api query
  const { data, status } = useQuery<Note[]>({
    queryKey: ["liquorTastingList", liquorId],
    queryFn: () => getLiquorTastingList(+liquorId),
  });

  return (
    <Stack sx={{ marginBottom: "10px", padding: "20px 0" }}>
      {status == "success" &&
        (data && data.length ? (
          data.map(({ type, tastingNote }, idx) =>
            type == "TASTING" ? (
              <TastingNoteCard key={idx} note={tastingNote} />
            ) : // <Link
            //   key={tastingNote.id}
            //   href={`/tasting-notes/${tastingNote.id}`}
            //   style={{ textDecoration: "none", color: "inherit" }}
            // >
            //   <Stack
            //     sx={{
            //       border: "solid 1px #dddddd",
            //       borderRadius: "5px 5px",
            //       padding: "15px 25px",
            //       gap: "15px",
            //     }}
            //   >
            //     {/* 카드 헤더 */}
            //     <Box
            //       sx={{
            //         display: "flex",
            //         flexDirection: "row",
            //         justifyContent: "space-between",
            //         alignItems: "center",
            //       }}
            //     >
            //       {/* 작성자 정보 */}
            //       <Box
            //         sx={{
            //           display: "flex",
            //           flexDirection: "row",
            //           alignItems: "center",
            //           gap: "20px",
            //         }}
            //       >
            //         <Image
            //           src={
            //             tastingNote.user.profileThumbnailImage || "default"
            //           }
            //           width={40}
            //           height={40}
            //           alt="user profile image"
            //           style={{ borderRadius: "15px" }}
            //         />
            //         <Stack sx={{ justifyContent: "center" }}>
            //           <Typography sx={{ fontWeight: "500" }}>
            //             {tastingNote.user.profileNickname}
            //           </Typography>
            //           <Typography sx={{ color: "gray", fontSize: "13px" }}>
            //             {formatDateTime(tastingNote.createdAt)}
            //           </Typography>
            //         </Stack>
            //       </Box>
            //       {/* 작성자 총점 */}
            //       <Box
            //         sx={{
            //           paddingRight: "5px",
            //           display: "flex",
            //           justifyContent: "center",
            //           alignItems: "center",
            //         }}
            //       >
            //         {tastingNote.score && <Chip label={tastingNote.score} />}
            //       </Box>
            //     </Box>

            //     <Divider />

            //     {/* 테이스팅 리뷰 내용: 상세 */}
            //     <Stack sx={{ gap: "5px" }}>
            //       <SingleTastingComponent
            //         keyContent="Nose"
            //         valueContent="테이스팅 노트입니다."
            //         detailContent={tastingNote.nose ? tastingNote.nose : ""}
            //         keyMinWidth={50}
            //       />
            //       <SingleTastingComponent
            //         keyContent="Palate"
            //         valueContent="테이스팅 노트입니다."
            //         detailContent={tastingNote.nose ? tastingNote.nose : ""}
            //         keyMinWidth={50}
            //       />
            //       <SingleTastingComponent
            //         keyContent="Finish"
            //         valueContent="테이스팅 노트입니다."
            //         detailContent={tastingNote.nose ? tastingNote.nose : ""}
            //         keyMinWidth={50}
            //       />
            //     </Stack>

            //     {/* 테이스팅 리뷰 내용: 총평 */}
            //     <Stack>
            //       <Typography
            //         sx={{
            //           // overflow: "hidden",
            //           // whiteSpace: "nowrap",
            //           // textOverflow: "ellipsis",
            //           fontSize: "15px",
            //         }}
            //       >
            //         &nbsp;{tastingNote.content}
            //       </Typography>
            //     </Stack>
            //   </Stack>
            // </Link>
            null
          )
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
