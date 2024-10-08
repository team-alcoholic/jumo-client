"use client";
import { Container, Typography, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";

const Header = styled(Typography)`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
`;

const SubHeader = styled(Typography)`
  font-size: 1.25rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem;
  padding: 0.5rem 2rem;
  font-size: 1rem;
  color: white;
  background-color: #1976d2;

  &:hover {
    background-color: #155fa0;
  }
`;

export default function Error() {
  return (
    <Container maxWidth="sm" sx={{ padding: 2, textAlign: "center" }}>
      <Box my={4}>
        <Header>JUMO</Header>
        <SubHeader>당신이 찾던 완벽한 주류모임, 주모</SubHeader>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Image src="/error.png" alt="Error" width={300} height={300} />
        </Box>
        <Typography variant="h6" color="error" gutterBottom>
          알 수 없는 오류가 발생했습니다
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
        </Typography>
        <Link href="/" passHref>
          <StyledButton sx={{ ml: 2 }}>홈으로 가기</StyledButton>
        </Link>
      </Box>
    </Container>
  );
}
