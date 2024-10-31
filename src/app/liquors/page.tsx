"use client";

import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "react-query";
import AddIcon from "@mui/icons-material/Add";

/** 주류 검색 API 요청 함수 */
const getLiquorList = async (keyword: string) => {
  if (!keyword) return null;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/liquorsearch?keyword=${keyword}`
  );
  return response.data;
};

export default function LiquorsPage() {
  // 검색 키워드 state
  const [keyword, setKeyword] = useState("");

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 주류 검색 api query
  const { data, status } = useQuery({
    queryKey: ["liquorList", keyword],
    queryFn: () => getLiquorList(keyword),
  });

  return (
    <Box>
      {/* 주류 검색창 */}
      <LiquorSearchBox>
        <TextField
          fullWidth
          placeholder="주류를 검색해보세요."
          value={keyword}
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: {
              height: "56px", // 텍스트 필드의 높이를 증가시킴
              fontSize: "16px", // 텍스트 크기를 키움
              padding: "0 12px", // 내부 패딩을 조정하여 더 넓게 보이도록 함
            },
          }}
          onChange={handleKeywordChange}
          sx={{
            fontSize: "16px", // 입력 텍스트의 크기를 증가시킴
            height: "56px", // 텍스트 필드 전체 높이를 키움
          }}
        />
      </LiquorSearchBox>
      {/* 로딩 UI */}
      {status === "loading" && (
        <SearchResultBox>
          <CircularProgress />
          <LoadingTypography>열심히 검색 중...</LoadingTypography>
        </SearchResultBox>
      )}

      {/* 검색 결과 */}
      {status == "success" &&
        (data && data.length ? (
          data.map((liquor: LiquorInfo) => (
            <LiquorCardLink key={liquor.id} href={`/liquors/${liquor.id}`}>
              <LiquorTitle
                thumbnailImageUrl={liquor.thumbnail_image_url}
                koName={liquor.ko_name}
                type={liquor.type}
                abv={liquor.abv}
                volume={liquor.volume}
                country={liquor.country}
                region={liquor.region}
                grapeVariety={liquor.grape_variety}
              />
            </LiquorCardLink>
          ))
        ) : (
          <SearchResultBox>
            <Box>
              <SearchResultTypography>
                검색 결과가 없습니다.
              </SearchResultTypography>
              <SearchResultTypography>가격 통합 비교 및</SearchResultTypography>
              <SearchResultTypography>
                테이스팅 노트 작성을 위해서는
              </SearchResultTypography>
              <SearchResultTypography>
                주류를 선택해야 합니다.
              </SearchResultTypography>

              <MarketInfoBox>
                <MarketInfoTitle>
                  🏪 현재 가격 비교 지원 중인 마켓
                </MarketInfoTitle>
                <MarketChipsContainer>
                  {[
                    "트레이더스",
                    "데일리샷",
                    "무카와",
                    "CU",
                    "겟주",
                    "롯데마트",
                    "이마트",
                  ].map((market) => (
                    <MarketChip key={market}>{market}</MarketChip>
                  ))}
                </MarketChipsContainer>
              </MarketInfoBox>
            </Box>
          </SearchResultBox>
        ))}
    </Box>
  );
}

const LiquorSearchBox = styled(Box)({
  margin: "10px 5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LiquorCardLink = styled(Link)({
  textDecoration: "none",
});

const SearchResultBox = styled(Box)({
  height: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const SearchResultTypography = styled(Typography)({
  textAlign: "center",
  color: "gray",
});

const LoadingTypography = styled(Typography)({
  textAlign: "center",
  color: "gray",
  marginTop: "16px",
});

const TipPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  maxWidth: "300px",
  width: "100%",
}));

const TipTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  fontSize: "0.9rem",
}));

const MarketInfoBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  maxWidth: "300px",
  margin: "32px auto 0",
}));

const MarketInfoTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
  textAlign: "center",
  fontWeight: 500,
}));

const MarketChipsContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  justifyContent: "center",
});

const MarketChip = styled(Box)(({ theme }) => ({
  padding: "4px 12px",
  borderRadius: "16px",
  fontSize: "0.85rem",
  backgroundColor: theme.palette.primary.main + "15",
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}30`,
}));
