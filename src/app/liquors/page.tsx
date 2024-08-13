"use client";

import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { Search } from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "react-query";

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
            <SearchResultTypography>
              검색 결과가 없습니다.
            </SearchResultTypography>
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
