import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { useQuery } from "react-query";
import { Search } from "@mui/icons-material";
import { LiquorList } from "./LiquorList";

/** LiquorSelectModal 컴포넌트 props 타입 */
interface LiquorSelectModalProps {
  open: boolean;
  value: Liquor | null;
  onClose: (value: Liquor | null) => void;
}

/** 주류 검색 API 요청 함수 */
const getLiquorList = async (keyword: string) => {
  if (!keyword) return null;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/liquorsearch?keyword=${keyword}`
  );
  return response.data;
};

export default function LiquorSelectModal(props: LiquorSelectModalProps) {
  const { open, value, onClose } = props;

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
    debounce((nextValue: string) => setDebouncedKeyword(nextValue), 300),
    []
  );

  /** 검색어 변경 처리 */
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    debounceKeywordChange(e.target.value);
  };

  /** 주류 선택 없이 모달 닫을 경우 처리 */
  const handleClose = () => {
    onClose(value);
  };
  /** 주류 선택할 경우 처리 */
  const handleLiquorListClick = (newValue: LiquorInfo) => {
    const result: Liquor = {
      id: newValue.id,
      koName: newValue.ko_name_origin,
      enName: newValue.en_name,
      type: newValue.type,
      abv: newValue.abv,
      volume: newValue.volume,
      country: newValue.country,
      thumbnailImageUrl: newValue.thumbnail_image_url,
      tastingNotesAroma: newValue.tasting_notes_Aroma,
      tastingNotesTaste: newValue.tasting_notes_Taste,
      tastingNotesFinish: newValue.tasting_notes_Finish,
      region: newValue.region,
      grapeVariety: newValue.grape_variety,
      category: null,
      liquorAromas: [],
      user: null,
    };
    onClose(result);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "500px",
        },
      }}
    >
      {/* 모달 제목 */}
      <DialogTitle>주류 선택</DialogTitle>

      {/* 주류 검색창 */}
      <Box
        sx={{
          margin: "10px 5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
      </Box>

      {/* 초기 화면 */}
      {/* {status == "idle" && (
        <Box
          sx={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Box>
            <Typography sx={{ textAlign: "center", color: "gray" }}>
              테이스팅 노트 작성을 위해서는
            </Typography>
            <Typography sx={{ textAlign: "center", color: "gray" }}>
              주류를 선택해야 합니다.
            </Typography>
          </Box>
        </Box>
      )} */}

      {/* 로딩 UI */}
      {isFetching && (
        <SearchResultBox>
          <CircularProgress />
          <Typography sx={{ textAlign: "center", color: "gray" }}>
            열심히 검색 중...
          </Typography>
        </SearchResultBox>
      )}

      {/* 검색 결과 */}
      {status == "success" &&
        (data && data.length ? (
          data.map((liquor: LiquorInfo) => (
            <Box
              sx={{ textDecoration: "none" }}
              key={liquor.id}
              onClick={() => handleLiquorListClick(liquor)}
            >
              <LiquorList
                thumbnailImageUrl={liquor.thumbnail_image_url}
                koName={liquor.ko_name_origin}
                type={liquor.type}
                abv={liquor.abv}
                volume={liquor.volume}
                country={liquor.country}
                region={liquor.region}
                grapeVariety={liquor.grape_variety}
              />
            </Box>
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
            </Box>
          </SearchResultBox>
        ))}
    </Dialog>
  );
}

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
