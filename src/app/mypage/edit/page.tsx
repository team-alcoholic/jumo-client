import UserUpdateForm from "@/components/UserUpdateForm/UserUpdateForm";
import { Stack, Typography } from "@mui/material";

export default function ProfileEditPage() {
  return (
    <Stack>
      <Typography>회원 정보 수정</Typography>
      <UserUpdateForm />
    </Stack>
  );
}
