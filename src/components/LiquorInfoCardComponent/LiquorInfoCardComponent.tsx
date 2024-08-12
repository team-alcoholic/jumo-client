import { Box, Divider, Stack, Typography } from "@mui/material";
import KeyValueInfoComponent from "../KeyValueInfoComponent/KeyValueInfoComponent";

export default function LiquorInfoCardComponent({
  liquor,
}: {
  liquor: LiquorData;
}) {
  /** 주류 기본 정보 */
  const LIQUOR_INFO_FIELDS = [
    { keyContent: "분류", valueContent: liquor.type },
    { keyContent: "도수", valueContent: liquor.abv },
    { keyContent: "국가", valueContent: liquor.country },
  ];
  /** 주류 테이스팅 정보 */
  const LIQUOR_TASTING_FIELDS = [
    { keyContent: "향 (Aroma)", valueContent: liquor.tastingNotesAroma },
    { keyContent: "맛 (Taste)", valueContent: liquor.tastingNotesTaste },
    { keyContent: "여운 (Finish)", valueContent: liquor.tastingNotesFinish },
  ];

  return (
    <Stack
      sx={{
        // border: "solid 1px #cccccc",
        // borderRadius: "5px 5px",
        padding: "10px",
        gap: "50px",
      }}
    >
      {/* 기본 정보 */}
      <Stack sx={{ gap: "8px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
          주류 기본 정보
        </Typography>
        {LIQUOR_INFO_FIELDS.map((data) => (
          <KeyValueInfoComponent
            key={data.keyContent}
            keyContent={data.keyContent}
            valueContent={data.valueContent}
            keyMinWidth={35}
          />
        ))}
      </Stack>

      {/* 테이스팅 노트 */}
      <Stack sx={{ gap: "8px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
          테이스팅 정보
        </Typography>
        {LIQUOR_TASTING_FIELDS.map((data) => (
          <KeyValueInfoComponent
            key={data.keyContent}
            keyContent={data.keyContent}
            valueContent={data.valueContent}
            keyMinWidth={100}
          />
        ))}
      </Stack>
    </Stack>
  );
}
