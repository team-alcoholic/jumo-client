import { CircularProgress } from "@mui/material";
import { LoadingContainerBox } from "./StyledComponents";

export default function MeetingLoading() {
  return (
    <LoadingContainerBox>
      <CircularProgress />
    </LoadingContainerBox>
  )
}