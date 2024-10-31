import { Stack } from "@mui/material";
import { redirect } from "next/navigation";
import ServiceIntroductionComponentV2 from "@/components/ServiceIntroductionComponent/ServiceIntroductionComponentV2";

export default function Home() {
  return (
    <Stack sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* 서비스 소개 및 유저 피드백 관련 컴포넌트 */}
      <ServiceIntroductionComponentV2 />
    </Stack>
  );
  // redirect("/meetings");
}
