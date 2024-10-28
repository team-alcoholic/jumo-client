import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function PageTitleComponent({ title }: { title: string }) {
  const router = useRouter();
  const handleButtonClick = () => {
    router.back();
  };

  return (
    <Stack>
      <Box
        sx={{
          padding: "30px 0",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box onClick={handleButtonClick}>
          <ArrowBack fontSize="small" />
        </Box>
        <Typography
          sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: "bold" }}
        >
          {title}
        </Typography>
      </Box>

      <Divider />
    </Stack>
  );
}
