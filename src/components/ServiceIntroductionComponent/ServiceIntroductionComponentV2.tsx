"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import Link from "next/link";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "20px 0",
  padding: "25px",
  minHeight: "100px",
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}15 100%)`,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StoreChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.primary.main + "15",
  color: theme.palette.primary.main,
  fontWeight: 500,
  "&:hover": {
    background: theme.palette.primary.main + "25",
  },
}));

const ActionButton = styled(Link)(({ theme }) => ({
  display: "inline-block",
  padding: "16px 32px",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: "white",
  borderRadius: "30px",
  textDecoration: "none",
  fontWeight: 600,
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  background: theme.palette.primary.main,
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "14px",
  marginRight: theme.spacing(1),
}));

const StepBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

export default function ServiceIntroductionComponent() {
  return (
    <StyledCard>
      <CardContent>
        <Stack spacing={4}>
          {/* 헤더 */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <CompareArrowsIcon color="primary" sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                주류 가격 통합 비교
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                국내외 주요 매장의 가격을 한 눈에 비교하세요
              </Typography>
            </Box>
          </Stack>

          {/* 사용 방법 */}
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ mb: 3 }}
            >
              이용 방법
            </Typography>
            <Stack spacing={2}>
              <FeatureBox>
                <SearchIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <StepBox>
                    <StepNumber>1</StepNumber>
                    <Typography variant="subtitle1" fontWeight={600}>
                      원하는 주류 검색
                    </Typography>
                  </StepBox>
                  <Typography variant="body2" color="text.secondary">
                    찾고 싶은 주류의 이름을 검색해보세요. 영문, 한글 모두
                    가능합니다.
                  </Typography>
                </Box>
              </FeatureBox>

              <FeatureBox>
                <TouchAppIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <StepBox>
                    <StepNumber>2</StepNumber>
                    <Typography variant="subtitle1" fontWeight={600}>
                      주류 선택
                    </Typography>
                  </StepBox>
                  <Typography variant="body2" color="text.secondary">
                    검색 결과에서 원하는 주류를 선택하세요.
                  </Typography>
                </Box>
              </FeatureBox>

              <FeatureBox>
                <PriceCheckIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <StepBox>
                    <StepNumber>3</StepNumber>
                    <Typography variant="subtitle1" fontWeight={600}>
                      가격 비교
                    </Typography>
                  </StepBox>
                  <Typography variant="body2" color="text.secondary">
                    각 매장별 실시간 가격을 한 눈에 비교하고 최저가를
                    확인하세요.
                  </Typography>
                </Box>
              </FeatureBox>
            </Stack>
          </Box>

          {/* 지원 매장 */}
          <FeatureBox>
            <StorefrontIcon color="primary" sx={{ fontSize: 30 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                지원 매장
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {["트레이더스", "데일리샷", "무카와", "CU"].map((store) => (
                  <StoreChip key={store} label={store} size="small" />
                ))}
              </Stack>
            </Box>
          </FeatureBox>

          {/* 행동 유도 버튼 */}
          <Box textAlign="center" mt={2}>
            <ActionButton href="/liquors">지금 바로 가격 비교하기</ActionButton>
          </Box>
        </Stack>
      </CardContent>
    </StyledCard>
  );
}
