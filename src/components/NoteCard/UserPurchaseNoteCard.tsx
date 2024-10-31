import { formatDateTime } from "@/utils/format";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import SingleTastingComponent from "../SingleTastingComponent/SingleTastingComponent";
import Image from "next/image";

export default function UserPurchaseNoteCard({ note }: { note: PurchaseNote }) {
  return (
    <Link
      key={note.id}
      href={`/purchase-notes/${note.id}`}
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
              src={note.liquor.thumbnailImageUrl || "default"}
              width={40}
              height={40}
              alt="user profile image"
              style={{ borderRadius: "15px" }}
            />
            <Stack sx={{ justifyContent: "center" }}>
              <Typography sx={{ fontWeight: "500" }}>
                {note.liquor.koName}
              </Typography>
              <Typography sx={{ color: "gray", fontSize: "13px" }}>
                {formatDateTime(note.createdAt)}
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
            {note.price && <Chip label={note.price} />}
          </Box>
        </Box>

        <Divider />

        {/* 테이스팅 리뷰 내용: 상세 */}
        <Stack sx={{ gap: "5px" }}>
          <SingleTastingComponent
            keyContent="Nose"
            valueContent={"구매 노트입니다"}
            detailContent={"note.nose"}
            keyMinWidth={50}
          />
          <SingleTastingComponent
            keyContent="Palate"
            valueContent={"구매 노트입니다"}
            detailContent={"note.palate"}
            keyMinWidth={50}
          />
          <SingleTastingComponent
            keyContent="Finish"
            valueContent={"구매 노트입니다"}
            detailContent={"note.finish"}
            keyMinWidth={50}
          />
        </Stack>

        {/* 테이스팅 리뷰 내용: 총평 */}
        <Stack>
          <Typography
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              fontSize: "15px",
            }}
          >
            {note.content}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
}
