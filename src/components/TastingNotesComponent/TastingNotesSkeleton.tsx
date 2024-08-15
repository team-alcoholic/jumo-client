import React from "react";
import { Container, Skeleton } from "@mui/material";

const TastingNotesSkeleton: React.FC = () => {
  return (
    <Container sx={{ margin: "30px 0" }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{ marginBottom: 2 }}
      />
      <Skeleton width="60%" height={40} sx={{ marginBottom: 2 }} />
      <Skeleton width="30%" height={30} sx={{ marginBottom: 4 }} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        sx={{ marginBottom: 4 }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={120}
        sx={{ marginBottom: 2 }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={120}
        sx={{ marginBottom: 2 }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={120}
        sx={{ marginBottom: 2 }}
      />
      <Skeleton width="100%" height={60} sx={{ marginBottom: 4 }} />
      <Skeleton width="100%" height={60} sx={{ marginBottom: 4 }} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        sx={{ marginBottom: 4 }}
      />
      <Skeleton variant="rectangular" width="100%" height={48} />
    </Container>
  );
};

export default TastingNotesSkeleton;
