import { CircularProgress } from "@mui/material";

export default function MeetingLoading() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </div>
  )
}