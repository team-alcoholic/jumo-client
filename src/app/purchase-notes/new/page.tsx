"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
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
interface PurchaseNoteReq {
  liquorId: number;
  noteImages: File[];
  purchaseAt: string;
  place: string;
  price: number;
  volume: number;
  content: string;
}

/** 이미지 미리보기 */
interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

const savePurchaseNote = async (data: PurchaseNoteReq) => {
  const formData = new FormData();
  formData.append("liquorId", `${data.liquorId}`);
  formData.append("purchaseAt", data.purchaseAt);
  formData.append("place", data.place);
  formData.append("price", `${data.price}`);
  formData.append("volume", `${data.volume}`);
  formData.append("content", data.content);
  data.noteImages.forEach((image) => {
    formData.append("noteImages", image);
  });

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes/purchase`,
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

function NewPurchaseNotePageComponent() {
  const { snackbar, showSnackbar, hideSnackbar } = useCustomSnackbar();
  const params = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const liquorId = params.get("liquorId");

  // states
  const [purchaseAt, setPurchaseAt] = useState<Dayjs | null>();
  const [place, setPlace] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [content, setContent] = useState("");
  const [noteImages, setNoteImages] = useState<FileWithPreview[]>([]);
  const handlePurchaseAtChange = (value: Dayjs | null) => {
    setPurchaseAt(value);
  };
  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(e.target.value);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(+e.target.value);
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(+e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
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
  const getLiquor = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/liquors/${liquorId}`
      );
      setLiquorData(await response.json());
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await getAuth();
      if (liquorId) await getLiquor();
    })();
  }, [getAuth, getLiquor]);

  // 컴포넌트 언마운트 시 모든 미리보기 URL 정리
  useEffect(() => {
    return () => {
      noteImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [noteImages]);

  const handleSave = async () => {
    if (!liquorData || !purchaseAt) {
      alert("주류를 선택해주세요.");
      return;
    }

    const noteSavingData: PurchaseNoteReq = {
      liquorId: liquorData.id,
      noteImages: noteImages.map((image) => image.file),
      purchaseAt: purchaseAt?.format("YYYY-MM-DD"),
      place,
      price,
      volume,
      content,
    };

    setSaving(true);

    try {
      const noteId = await savePurchaseNote(noteSavingData);
      router.push(`/purchase-notes/${noteId}`);
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
    <Suspense>
      <Stack>
        <PageTitleComponent title="구매 노트 작성하기" />
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
              <Typography>어떤 주류를 구매했나요?</Typography>
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

          {/* 구매 장소 */}
          <Stack sx={{ gap: "10px" }}>
            <Typography>어디서 구매했나요?</Typography>
            <TextField
              label="구매 장소"
              variant="outlined"
              size="small"
              value={place}
              onChange={handlePlaceChange}
            />
          </Stack>

          <Stack sx={{ gap: "10px" }}>
            <Typography>언제 구매했나요?</Typography>
            <DatePicker
              label="구매 일자"
              format="YYYY년 MM월 DD일"
              slotProps={{ textField: { size: "small" } }}
              value={purchaseAt}
              onChange={handlePurchaseAtChange}
            />
          </Stack>

          <Stack sx={{ gap: "10px" }}>
            <Typography>얼마에 구매했나요?</Typography>
            <TextField
              label="가격"
              variant="outlined"
              size="small"
              value={price}
              onChange={handlePriceChange}
            />
          </Stack>

          <Stack sx={{ gap: "10px" }}>
            <Typography>용량은 얼마인가요?</Typography>
            <TextField
              label="용량"
              variant="outlined"
              size="small"
              value={volume}
              onChange={handleVolumeChange}
            />
          </Stack>

          {/* 본문 및 이미지 */}
          <Stack sx={{ gap: "10px" }}>
            <Typography>후기를 자유롭게 작성해주세요.</Typography>

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
            <TextField
              label="본문"
              variant="outlined"
              size="medium"
              multiline
              value={content}
              onChange={handleContentChange}
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
              <DialogTitle id="alert-dialog-title">
                {"작성 취소하기"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  현재 작성 중인 테이스팅 노트의 내용이 저장되지 않습니다.
                  정말로 취소하시겠습니까?
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
    </Suspense>
  );
}

export default function NewPurchaseNotePage() {
  return (
    <Suspense>
      <NewPurchaseNotePageComponent />
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
