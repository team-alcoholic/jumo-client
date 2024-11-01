import PageTitleComponent from "@/components/LayoutComponents/PageTitleComponent";
import UserUpdateForm from "@/components/UserUpdateForm/UserUpdateForm";
import { Stack, Typography } from "@mui/material";

export default function ProfileEditPage() {
  return (
    <Stack sx={{ gap: "30px" }}>
      <PageTitleComponent title="사용자 정보 수정" />
      <UserUpdateForm />
    </Stack>
  );
}
