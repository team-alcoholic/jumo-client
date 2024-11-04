import { formatDateTime, formatFullDateTime } from "@/utils/format";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function UserInfoComponent({
  user,
  createdAt,
}: {
  user: User;
  createdAt: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "5px",
        gap: "15px",
      }}
    >
      <Image
        src={user.profileThumbnailImage}
        alt="user image"
        width={40}
        height={40}
        style={{ borderRadius: "10px" }}
      />
      <Stack>
        <Typography sx={{ fontSize: "15px" }}>
          {user.profileNickname}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "#757575" }}>
          {formatFullDateTime(createdAt)}
        </Typography>
      </Stack>
    </Box>
  );
}
