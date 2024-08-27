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
import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import AddIcon from "@mui/icons-material/Add";
import debounce from "lodash.debounce";

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
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  // 주류 검색 api query
  const { data, status, isFetching } = useQuery({
    queryKey: ["liquorList", debouncedKeyword],
    queryFn: () => getLiquorList(debouncedKeyword),
    enabled: !!debouncedKeyword,
  });

  // debounce function
  const debounceKeywordChange = useCallback(
    debounce((nextValue: string) => setDebouncedKeyword(nextValue), 200),
    []
  );

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    debounceKeywordChange(e.target.value);
  };

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

      {/* 초기 화면 */}
      {status == "idle" && (
        <SearchResultBox>
          <Box>
            <SearchResultTypography>
              테이스팅 노트 작성을 위해서는
            </SearchResultTypography>
            <SearchResultTypography>
              주류를 선택해야 합니다.
            </SearchResultTypography>
            <TipPaper elevation={1}>
              <TipTypography>💡 Tip: 찾는 주류가 없으신가요?</TipTypography>
              <Link href="/liquors/new" passHref>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  size="small"
                >
                  주류 직접 추가하기
                </Button>
              </Link>
            </TipPaper>
          </Box>
        </SearchResultBox>
      )}

      {/* 로딩 UI */}
      {isFetching && (
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
              <SearchResultTypography>
                테이스팅 노트 작성을 위해서는
              </SearchResultTypography>
              <SearchResultTypography>
                주류를 선택해야 합니다.
              </SearchResultTypography>
              <TipPaper elevation={1}>
                <TipTypography>💡 Tip: 찾는 주류가 없으신가요?</TipTypography>
                <Link href="/liquors/new" passHref>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    fullWidth
                    size="small"
                  >
                    주류 직접 추가하기
                  </Button>
                </Link>
              </TipPaper>
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
  gap: "10px",
});

const SearchResultTypography = styled(Typography)({
  textAlign: "center",
  color: "gray",
});

const LoadingTypography = styled(Typography)({
  textAlign: "center",
  color: "gray",
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
