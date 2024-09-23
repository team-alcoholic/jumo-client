import { Liquor } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

export default function UserNoteGroupComponent({
  data,
}: {
  data: UserNoteGroup[];
}) {
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
        내가 감상한 주류
      </Typography>

      {/* 감상 주류 목록 */}
      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        columns={{ xs: 12, sm: 12, md: 12 }}
      >
        {data.map((group: UserNoteGroup, idx) => (
          <Grid item key={idx} xs={4} sm={4} md={4}>
            <Card sx={{ maxWidth: 345, height: { xs: "165px", md: "270px" } }}>
              {/* 주류 사진 */}
              <CardMedia
                component="img"
                image={group.liquor.thumbnailImageUrl}
                sx={{ height: { xs: "100px", md: "200px" } }}
              />

              {/* 주류 정보 */}
              <CardContent sx={{ padding: "10px", height: "65px" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", md: "12px" },
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {group.liquor.koName}
                </Typography>
                {group.liquor.enName && (
                  <Typography
                    sx={{
                      fontSize: { xs: "8px", md: "10px" },
                      color: "gray",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {group.liquor.enName}
                  </Typography>
                )}
                <Typography
                  sx={{
                    paddingTop: "5px",
                    fontSize: { xs: "10px", md: "10px" },
                    color: "gray",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {group.notesCount}개의 노트
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
