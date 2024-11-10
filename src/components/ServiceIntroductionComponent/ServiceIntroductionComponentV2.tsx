"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { EditNote } from "@mui/icons-material";

const GOOGLE_FORM_URL = "https://forms.gle/cuoJy7uJF4r2ewMg9";
const KAKAO_OPENCHAT_URL = "https://open.kakao.com/o/sSDeVvGg";

export default function ServiceIntroductionComponent() {
  return (
    <Card
      variant="outlined"
      sx={{
        margin: "20px 0",
        padding: "32px",
        minHeight: "100px",
        background: "#fff",
        borderRadius: "24px",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Stack spacing={4}>
          {/* 헤더 */}
          <Stack spacing={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "20px", md: "32px" },
                letterSpacing: "-0.02em",
              }}
            >
              주류 가격 통합 비교
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                letterSpacing: "-0.01em",
              }}
            >
              국내외 주요 매장의 가격을 한 눈에 비교하세요
            </Typography>
          </Stack>
            {/* 업데이트 소식 */}
            <Stack spacing={2}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: "15px", md: "18px" },
                        letterSpacing: "-0.01em",
                    }}
                >
                    업데이트 소식
                </Typography>

                {/* 새 기능 알림 */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        p: { xs: 2, md: 2.5 },
                        bgcolor: "#FFF4E5",
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "#FFE0B2",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            bgcolor: "#FFE0B2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Box
                            component="span"
                            role="img"
                            aria-label="new"
                            sx={{
                                fontSize: { xs: "20px", md: "24px" },
                                lineHeight: 1,
                            }}
                        >
                            🎉
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "14px", md: "15px" },
                                color: "#E65100",
                                lineHeight: 1.4,
                            }}
                        >
                            New! 주류 구매 노트 작성 기능 추가
                        </Typography>
                    </Box>
                </Box>

                {/* 버그 수정 알림 */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        p: { xs: 2, md: 2.5 },
                        bgcolor: "#F5F5F5",
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "#E0E0E0",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            bgcolor: "#E0E0E0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Box
                            component="span"
                            role="img"
                            aria-label="bug-fix"
                            sx={{
                                fontSize: { xs: "20px", md: "24px" },
                                lineHeight: 1,
                            }}
                        >
                            🛠️
                        </Box>
                    </Box>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "14px", md: "15px" },
                                color: "#424242",
                                lineHeight: 1.4,
                            }}
                        >
                            버그 수정 및 개선
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5, fontSize: { xs: "13px", md: "14px" }, color: "#616161" }}>
                            <li>겟주 URL 오류 수정</li>
                            <li>일본어 번역 오류 개선</li>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
          {/* 사용 방법 */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "15px", md: "18px" },
                letterSpacing: "-0.01em",
              }}
            >
              이용 방법
            </Typography>
            <Stack spacing={2}>
              {[
                {
                  icon: <SearchIcon fontSize="small" />,
                  step: "1",
                  title: "원하는 주류 검색",
                  desc: "찾고 싶은 주류의 이름을 검색해보세요. 영문, 한글 모두 가능합니다.",
                },
                {
                  icon: <TouchAppIcon fontSize="small" />,
                  step: "2",
                  title: "주류 선택",
                  desc: "검색 결과에서 원하는 주류를 선택하세요.",
                },
                {
                  icon: <PriceCheckIcon fontSize="small" />,
                  step: "3",
                  title: "가격 비교",
                  desc: "각 매장별 실시간 가격을 한 눈에 비교하고 최저가를 확인하세요.",
                },
                {
                  icon: <EditNote fontSize="small" />,
                  step: "4",
                  title: "노트 기록",
                  desc: "주류에 대한 구매 노트와 테이스팅 노트를 작성해 기록을 남겨보세요.",
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2.5,
                    p: { xs: 2, md: 2.5 },
                    bgcolor: "grey.50",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "grey.100",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 20, md: 40 },
                      height: { xs: 30, md: 40 },
                      borderRadius: "12px",
                      bgcolor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "grey.900",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={0.5}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "6px",
                          bgcolor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "grey.900",
                        }}
                      >
                        {item.step}
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "15px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "14px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* 지원 매장 */}
          <Box
            sx={{
              display: "flex",
              gap: 2.5,
              p: 2.5,
              bgcolor: "grey.50",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StorefrontIcon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "15px", mb: 1.5 }}>
                지원 매장
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {[
                  "트레이더스",
                  "데일리샷",
                  "무카와",
                  "CU",
                  "겟주",
                  "롯데마트",
                  "이마트",
                  "빅카메라",
                ].map((store) => (
                  <Chip
                    key={store}
                    label={store}
                    sx={{
                      bgcolor: "grey.100",
                      color: "grey.900",
                      fontWeight: 600,
                      fontSize: "13px",
                      height: "28px",
                      "&:hover": {
                        bgcolor: "grey.200",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>

          {/* CTA 버튼 */}
          <Box sx={{ textAlign: "center" }}>
            <Link
              href="/liquors"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "#1a1a1a",
                color: "#ffffff",
                borderRadius: "16px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "15px",
                transition: "all 0.2s ease",
              }}
            >
              지금 바로 가격 비교하기
            </Link>
          </Box>

          {/* 피드백 섹션 */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "grey.50",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "15px",
                mb: 2,
                letterSpacing: "-0.01em",
              }}
            >
              문의 및 피드백
            </Typography>
            <Stack spacing={1.5}>
              {[
                {
                  icon: "/Google_logo.png",
                  title: "매장 추가 요청 / 기능 제안하기",
                  desc: "Google Form으로 의견을 제출해주세요",
                  url: GOOGLE_FORM_URL,
                },
                {
                  icon: "/KakaoTalk_logo.svg",
                  title: "오픈채팅방 참여하기",
                  desc: "실시간으로 소통하고 피드백을 나눠보세요",
                  url: KAKAO_OPENCHAT_URL,
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  style={{ textDecoration: "none" }}
                  target="_blank"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: "12px 16px",
                      bgcolor: "common.white",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "grey.200",
                      "&:hover": {
                        bgcolor: "grey.50",
                        transform: "translateY(-1px)",
                        transition: "all 0.2s ease",
                      },
                    }}
                  >
                    <Avatar src={item.icon} sx={{ width: 24, height: 24 }} />
                    <Box>
                      <Typography
                        sx={{
                          color: "grey.900",
                          fontSize: "14px",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "13px",
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
