// 지정된 유저가 작성한 모든 주류 테이스팅 리뷰 목록 보여주는 컴포넌트

"use client";

import { Stack, Typography } from "@mui/material";
import UserPurchaseNoteCard from "../NoteCard/UserPurchaseNoteCard";
import UserTastingNoteCard from "../NoteCard/UserTastingNoteCard";

export default function UserTastingComponent({ data }: { data: Note[] }) {
  return (
    <Stack sx={{ marginBottom: "10px", padding: "20px 0", gap: "15px" }}>
      {/* 소제목 */}
      <Typography
        sx={{
          fontSize: "12px",
          color: "gray",
          textAlign: "center",
        }}
      >
        내가 작성한 테이스팅 노트
      </Typography>

      {/* 테이스팅 노트 목록 */}
      {data.map((note: Note, idx) =>
        note.type == "PURCHASE" ? (
          <UserPurchaseNoteCard key={idx} note={note.purchaseNote} />
        ) : (
          <UserTastingNoteCard key={idx} note={note.tastingNote} />
        )
      )}
    </Stack>
  );
}
