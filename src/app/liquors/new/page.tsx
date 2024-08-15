"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Container,
  Box,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Dialog,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import axios from "axios";
import { router } from "next/client";
import { useRouter } from "next/navigation";

// 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    error: {
      main: "#f44336",
    },
  },
});

// 스타일된 컴포넌트 정의
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: "100%",
  backgroundColor: "#f8f8f8",
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const WARNING_MESSAGE =
  "주의: 주류 정보 등록 시 모든 사용자와 공유되며, 등록 후 직접 수정 및 삭제가 불가능합니다. 추후 운영진이 정보를 검토하고 업데이트할 수 있습니다. 수정이나 삭제가 필요한 경우 구글 폼 또는 오픈카톡방을 통해 요청하실 수 있습니다.";

const INFO_MESSAGE =
  "상세한 정보를 입력할수록 인공지능이 더 정확한 테이스팅 노트를 추천해드릴 수 있습니다.";

interface LiquorFormData {
  koName: string;
  abv?: number;
  country?: string;
  type?: string;
  volume?: number;
  region?: string;
}

const countries = [
  "프랑스",
  "이탈리아",
  "스페인",
  "미국",
  "영국",
  "스코틀랜드",
  "아일랜드",
  "독일",
  "일본",
  "대한민국",
  "멕시코",
  "러시아",
  "캐나다",
  "쿠바",
  "포르투갈",
  "그리스",
  "호주",
  "칠레",
  "아르헨티나",
  "중국",
  "기타",
];

const categories = [
  "소주",
  "맥주",
  "와인",
  "싱글몰트 위스키",
  "블렌디드 위스키",
  "버번 위스키",
  "라이 위스키",
  "아이리시 위스키",
  "보드카",
  "럼",
  "진",
  "데킬라",
  "브랜디",
  "리큐르",
  "기타",
];

const LiquorForm: React.FC = () => {
  const { control, handleSubmit, setValue } = useForm<LiquorFormData>();
  const router = useRouter();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            withCredentials: true,
          },
        );
        setIsLoggedIn(true);
        const savedData = localStorage.getItem("liquorFormData");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          onSubmit(parsedData);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("liquorFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      onSubmit(parsedData);
    }
  }, [setValue]);

  const onSubmit = async (data: LiquorFormData) => {
    console.log("폼 제출 시작", data);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/liquors`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      console.log("서버 응답:", response.data);
      localStorage.removeItem("liquorFormData");
      const liquorId = response.data;
      router.push(`/tasting-notes/new?liquorId=${liquorId}`);
    } catch (error) {
      console.error("에러 발생:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log("401 에러 감지, 로그인 페이지로 리다이렉트");
        localStorage.setItem("liquorFormData", JSON.stringify(data));
        setOpenLoginDialog(true);
      } else {
        console.error("API 호출 중 에러 발생:", error);
      }
    }
  };

  const handleLoginRedirect = () => {
    console.log("로그인 페이지로 리다이렉트"); // 디버깅 로그
    setOpenLoginDialog(false);
    const redirectUrl = window.location.href;
    router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`);
  };
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters>
        <FormContainer elevation={3}>
          <Typography variant="h4" gutterBottom>
            주류 정보 입력
          </Typography>
          <Box mb={3}>
            <Alert severity="warning">{WARNING_MESSAGE}</Alert>
          </Box>
          <Box mb={3}>
            <Alert severity="info">{INFO_MESSAGE}</Alert>
          </Box>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="koName"
              control={control}
              rules={{
                required: "주류명은 필수입니다",
                maxLength: {
                  value: 200,
                  message: "주류명은 200자를 초과할 수 없습니다.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="주류명 (필수 입력)"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: <Typography color="error">*</Typography>,
                  }}
                />
              )}
            />

            <Controller
              name="abv"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "알코올 도수는 0 이상이어야 합니다.",
                },
                max: {
                  value: 100,
                  message: "알코올 도수는 100 이하여야 합니다.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="알코올 도수 (%)"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>국가</InputLabel>
                  <Select {...field} label="국가">
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>주종</InputLabel>
                  <Select {...field} label="주종">
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="volume"
              control={control}
              rules={{
                min: { value: 0, message: "용량은 0보다 커야 합니다." },
                max: { value: 100000, message: "용량이 너무 큽니다." },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="용량 (ml)"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="region"
              control={control}
              rules={{
                maxLength: {
                  value: 200,
                  message: "지역명은 200자를 초과할 수 없습니다.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="지역"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              제출 후 테이스팅 노트 작성하러 가기
            </Button>
          </Form>
        </FormContainer>
      </Container>
      <Dialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"로그인이 필요합니다"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            주류 정보를 제출하기 위해서는 로그인/회원가입이 필요합니다. 입력하신
            정보는 안전하게 저장되어 있으며, 로그인/회원가입 후 자동으로
            복원됩니다. 로그인/회원가입 페이지로 이동하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>취소</Button>
          <Button onClick={handleLoginRedirect} autoFocus>
            카카오 1초 로그인
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LiquorForm;
