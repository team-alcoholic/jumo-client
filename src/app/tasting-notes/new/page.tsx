"use client";

import React, {
  Suspense,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Rating,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { fetchLiquorData } from "@/api/tastingNotesApi";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CustomSnackbar,
  useCustomSnackbar,
} from "@/components/Snackbar/CustomSnackbar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Add, Close } from "@mui/icons-material";
import LiquorSelectModal from "@/components/NoteComponent/LiquorSelectModal";
import { Dayjs } from "dayjs";
import PageTitleComponent from "@/components/LayoutComponents/PageTitleComponent";
import Image from "next/image";
import axios from "axios";

/** 구매 노트 생성 요청 type */
interface TastingNoteReq {
  liquorId: number;
  noteImages: File[];
  noteAromas: number[];
  tastingAt: string;
  place: string;
  method: string;
  score: number;
  content: string;
  isDetail: boolean;
  nose: string;
  palate: string;
  finish: string;
}

/** 이미지 미리보기 */
interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

const saveTastingNote = async (data: TastingNoteReq) => {
  const formData = new FormData();
  formData.append("liquorId", `${data.liquorId}`);
  formData.append("tastingAt", data.tastingAt);
  formData.append("place", data.place);
  formData.append("method", data.method);
  formData.append("score", `${data.score}`);
  formData.append("content", data.content);
  formData.append("isDetail", `${data.isDetail}`);
  formData.append("nose", data.nose);
  formData.append("palate", data.palate);
  formData.append("finish", data.finish);
  data.noteImages.forEach((image) => {
    formData.append("noteImages", image);
  });
  data.noteAromas.forEach((aroma) => {
    formData.append("noteAromas", `${aroma}`);
  });

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes/tasting`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data.id;
  } catch (err) {
    console.error(err);
  }
};

/** 주류 상세정보 API 요청 함수 */
const getLiquor = async (liquorId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/liquors/${liquorId}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

/** 아로마 추천 API 요청 함수 */
const getRecommendAroma = async (aromaId: number, exclude: number[]) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/aromas/similar`,
      { params: { aromaId, exclude: exclude.join(",") } }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

/** 아로마 추가 API 요청 함수 */
const createCustomAroma = async (aromaName: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/aromas`,
      { aromaName }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

function NewTastingNotePageComponent() {
  const { snackbar, showSnackbar, hideSnackbar } = useCustomSnackbar();
  const params = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const liquorIdParam = params.get("liquorId");

  // states
  const [tastingAt, setTastingAt] = useState<Dayjs | null>();
  const [place, setPlace] = useState("");
  const [method, setMethod] = useState("");
  const [score, setScore] = useState<number>(0);
  const [content, setContent] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [nose, setNose] = useState("");
  const [palate, setPalate] = useState("");
  const [finish, setFinish] = useState("");
  const [noteImages, setNoteImages] = useState<FileWithPreview[]>([]);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [selectedAromas, setSelectedAromas] = useState<Aroma[]>([]);
  const [customAroma, setCustomAroma] = useState("");
  const handleTastingAtChange = (value: Dayjs | null) => {
    setTastingAt(value);
  };
  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(e.target.value);
  };
  const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMethod(e.target.value);
  };
  const handleScoreChange = (
    e: SyntheticEvent<Element, Event>,
    value: number | null
  ) => {
    if (value) setScore(value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const handleIsDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setIsDetail(checked);
  };
  const handleNoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNose(e.target.value);
  };
  const handlePalateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPalate(e.target.value);
  };
  const handleFinishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinish(e.target.value);
  };
  const handleCustomAromaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAroma(e.target.value);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}`,
    }));
    setNoteImages((prev) => [...prev, ...newFiles]);
  };
  const handleImageRemove = useCallback((indexToRemove: number) => {
    setNoteImages((prev) => {
      // 삭제되는 파일의 미리보기 URL 해제
      URL.revokeObjectURL(prev[indexToRemove].preview);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  }, []);
  const handleImageButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  const [liquorData, setLiquorData] = useState<Liquor | null>(null);
  const handleClearLiquorData = () => {
    setLiquorData(null);
  };

  // 주류 선택 모달 관련 state 및 callback
  const [openLiquorDialog, setOpenLiquorDialog] = useState(false);
  const handleOpenLiquorDialog = () => {
    setOpenLiquorDialog(true);
  };
  const handleCloseLiquorDialog = (value: Liquor | null) => {
    setOpenLiquorDialog(false);
    setLiquorData(value);
  };

  const [saving, setSaving] = useState(false); // 추가
  const [openCancelDialog, setopenCancelDialog] = useState(false);
  const handleCancel = () => {
    setopenCancelDialog(true);
  };
  const handleCancelRedirect = () => {
    setopenCancelDialog(false);
    router.back();
  };

  /** 테이스팅 칩 선택 처리 */
  const handleAromaSelect = async (newAroma: Aroma) => {
    let deleted = false;

    const newSelectedAromas = selectedAromas.filter((aroma) => {
      if (aroma.id === newAroma.id) {
        deleted = true;
        return false;
      }
      return true;
    });

    if (!deleted) {
      // selectedAromas에 newAroma 추가
      newSelectedAromas.push(newAroma);

      // 아로마 추천 API 호출
      const recommendedAromas = await getRecommendAroma(
        newAroma.id,
        aromas.map((aroma) => aroma.id)
      );
      setAromas([...aromas, ...recommendedAromas]);
    }

    setSelectedAromas(newSelectedAromas);
  };

  const handleCustomAromaCreate = async () => {
    if (customAroma) {
      const newAroma = await createCustomAroma(customAroma);
      const isExist = aromas.some((aroma: Aroma) => aroma.id == newAroma.id);
      if (!isExist) setAromas((prev) => [...prev, newAroma]);
      setCustomAroma("");
    }
  };

  const getAuth = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users`,
        {
          method: "GET",
          credentials: "include", // 세션 기반 인증에 필요한 경우 추가
        }
      );

      if (response.status === 401) {
        alert(
          "노트 작성은 로그인이 필요합니다. 카카오 1초 로그인을 진행해보세요!"
        );
        const redirectUrl = window.location.href;
        router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`);
      } else {
        await response.json();
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
  }, [router]);

  const loadLiquorData = useCallback(async () => {
    try {
      if (liquorIdParam) {
        const data = await fetchLiquorData(liquorIdParam);
        setLiquorData(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [liquorIdParam, router]);

  useEffect(() => {
    (async () => {
      await getAuth();
      await loadLiquorData();
    })();
  }, [getAuth]);

  useEffect(() => {
    (async () => {
      if (liquorData) {
        const result: Liquor = await getLiquor(liquorData.id);
        setAromas(result.liquorAromas);
      } else setAromas([]);
    })();
  }, [liquorData]);

  // 컴포넌트 언마운트 시 모든 미리보기 URL 정리
  useEffect(() => {
    return () => {
      noteImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [noteImages]);

  const handleSave = async () => {
    if (!liquorData || !tastingAt) {
      alert("주류를 선택해주세요.");
      return;
    }

    const noteSavingData: TastingNoteReq = {
      liquorId: liquorData.id,
      noteImages: noteImages.map((image) => image.file),
      noteAromas: selectedAromas.map((aroma) => aroma.id),
      tastingAt: tastingAt?.format("YYYY-MM-DD"),
      place,
      method,
      score,
      content,
      isDetail,
      nose,
      palate,
      finish,
    };

    setSaving(true);

    try {
      const noteId = await saveTastingNote(noteSavingData);
      router.push(`/tasting-notes/${noteId}`);
      showSnackbar("저장에 성공했습니다.", "success");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      showSnackbar(`저장 실패: ${errorMessage}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack>
      <PageTitleComponent title="테이스팅 노트 작성하기" />
      <Stack sx={{ margin: "30px 0", gap: "30px" }}>
        {/* 주류 선택 */}
        <Stack sx={{ gap: "5px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography>어떤 주류를 마셨나요?</Typography>
            <Button size="small" onClick={handleClearLiquorData}>
              초기화
            </Button>
          </Box>
          {liquorData ? (
            <Box onClick={handleOpenLiquorDialog}>
              <LiquorTitle
                thumbnailImageUrl={liquorData.thumbnailImageUrl}
                koName={liquorData.koName}
                type={liquorData.type}
                abv={liquorData.abv}
                volume={liquorData.volume}
                country={liquorData.country}
                region={liquorData.region}
                grapeVariety={liquorData.grapeVariety}
              />
            </Box>
          ) : (
            <Button
              fullWidth
              sx={{
                height: "120px",
                border: "1px dashed",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
              onClick={handleOpenLiquorDialog}
            >
              <Add />
              <Typography>주류를 선택해주세요.</Typography>
            </Button>
          )}
          <LiquorSelectModal
            open={openLiquorDialog}
            value={liquorData}
            onClose={handleCloseLiquorDialog}
          />
        </Stack>

        {/* 감상 장소 */}
        <Stack sx={{ gap: "10px" }}>
          <Typography>어디서 마셨나요?</Typography>
          <TextField
            label="감상 장소"
            variant="outlined"
            size="small"
            value={place}
            onChange={handlePlaceChange}
          />
        </Stack>

        {/* 감상 일자 */}
        <Stack sx={{ gap: "10px" }}>
          <Typography>언제 마셨나요?</Typography>
          <DatePicker
            label="감상 일자"
            format="YYYY년 MM월 DD일"
            slotProps={{ textField: { size: "small" } }}
            value={tastingAt}
            onChange={handleTastingAtChange}
          />
        </Stack>

        {/* 감상 방법 */}
        <Stack sx={{ gap: "10px" }}>
          <Typography>어떤 방법으로 마셨나요?</Typography>
          <TextField
            label="감상 방법"
            variant="outlined"
            size="small"
            value={method}
            onChange={handleMethodChange}
          />
        </Stack>

        {/* 아로마 선택 */}
        <Stack sx={{ gap: "10px" }}>
          <Stack>
            <Typography>어떤 향이 느껴졌나요?</Typography>
            <Typography
              color="textSecondary" // 연한 색상 사용
              sx={{ fontSize: "12px", fontWeight: 400 }} // 크기를 더 작게 설정
            >
              키워드를 선택하면, 인공지능이 계속해서 추천해줍니다.
            </Typography>
          </Stack>

          {/* 키워드 선택 */}
          <Box
            sx={{
              padding: "10px 10px",
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              width: "100%",
              backgroundColor: "whitesmoke",
              borderRadius: "5px",
            }}
          >
            {aromas && aromas.length ? (
              aromas.map((aroma: Aroma, index) => (
                <StyledChip
                  sx={{ margin: "2px", color: "black", fontSize: "12px" }}
                  key={index}
                  label={aroma.name}
                  onClick={() => handleAromaSelect(aroma)}
                  selected={selectedAromas.some(
                    (selectedAroma) => selectedAroma.id === aroma.id
                  )}
                />
              ))
            ) : (
              <Typography
                color="textSecondary" // 연한 색상 사용
                align="center"
                sx={{ fontSize: "12px", fontWeight: 400 }} // 크기를 더 작게 설정
              >
                추천 키워드가 없습니다.
              </Typography>
            )}
          </Box>

          {/* 키워드 추가 */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <TextField
              fullWidth
              label="키워드 추가"
              variant="outlined"
              size="small"
              value={customAroma}
              onChange={handleCustomAromaChange}
            />
            <Button
              variant="outlined"
              onClick={handleCustomAromaCreate}
              style={{
                width: "16px",
                height: "40px",
                padding: 0,
              }}
            >
              <Add />
            </Button>
          </Box>
        </Stack>

        {/* 점수 */}
        <Stack sx={{ gap: "10px" }}>
          <Typography>점수를 매겨주세요!</Typography>
          <Rating
            name="simple-controlled"
            value={score}
            onChange={handleScoreChange}
          />
        </Stack>

        {/* 본문 및 이미지 */}
        <Stack sx={{ gap: "10px" }}>
          <Typography>테이스팅 노트를 자유롭게 작성해주세요.</Typography>

          {/* 이미지 목록 */}
          {noteImages.length ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
                overflowX: "auto",
              }}
            >
              {noteImages.map((image, idx) => {
                return (
                  <Box
                    key={image.id}
                    sx={{
                      flexShrink: 0, // 이미지가 찌그러지지 않도록
                      position: "relative", // 삭제 버튼을 위한 설정
                    }}
                  >
                    <Image
                      src={image.preview}
                      alt="note image"
                      width={80}
                      height={80}
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleImageRemove(idx)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "background.paper",
                        boxShadow: 1,
                        "&:hover": {
                          backgroundColor: "background.paper",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          ) : null}

          {/* 이미지 버튼 */}
          <Button
            fullWidth
            onClick={handleImageButtonClick}
            sx={{
              border: "1px dashed",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <Add />
            <Typography sx={{ fontSize: { xs: "15px" } }}>
              이미지 추가하기
            </Typography>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {/* 본문 */}
          {isDetail ? (
            <Stack sx={{ gap: "5px" }}>
              <TextField
                label="Nose"
                variant="outlined"
                size="medium"
                multiline
                value={nose}
                onChange={handleNoseChange}
              />
              <TextField
                label="Palate"
                variant="outlined"
                size="medium"
                multiline
                value={palate}
                onChange={handlePalateChange}
              />
              <TextField
                label="Finish"
                variant="outlined"
                size="medium"
                multiline
                value={finish}
                onChange={handleFinishChange}
              />
            </Stack>
          ) : null}

          {/* 본문 */}
          <TextField
            label="본문"
            variant="outlined"
            size="medium"
            multiline
            value={content}
            onChange={handleContentChange}
          />

          {/* 상세작성 버튼 */}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                value={isDetail}
                onChange={handleIsDetailChange}
              />
            }
            label="상세작성"
          />
        </Stack>

        {/* 버튼 그룹 */}
        <Stack>
          {/* 버튼 */}
          <SaveButton
            onClick={handleSave}
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : "저장하기"}
          </SaveButton>
          <SaveButton
            onClick={handleCancel}
            variant="contained"
            disabled={saving}
          >
            취소하기
          </SaveButton>
          <CustomSnackbar
            isOpen={snackbar.isOpen}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={hideSnackbar}
          />

          {/* 취소 시 dialog */}
          <Dialog
            open={openCancelDialog}
            onClose={() => setopenCancelDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"작성 취소하기"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                현재 작성 중인 테이스팅 노트의 내용이 저장되지 않습니다. 정말로
                취소하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setopenCancelDialog(false)}>취소</Button>
              <Button onClick={handleCancelRedirect} autoFocus>
                확인
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function NewTastingNotePage() {
  return (
    <Suspense>
      <NewTastingNotePageComponent />
    </Suspense>
  );
}

const SaveButton = styled(Button)({
  marginTop: "20px",
  width: "100%",
  padding: "10px",
  backgroundColor: "#3f51b5",
  color: "#ffffff",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const StyledChip = styled(Chip)<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? "#ffeb3b" : "#e0e0e0",
  // 호버링 애니메이션 제거
  "&:hover": {
    backgroundColor: selected ? "#ffeb3b" : "#e0e0e0",
  },
}));
