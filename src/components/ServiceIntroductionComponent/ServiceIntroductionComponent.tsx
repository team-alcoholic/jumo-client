import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

const GOOGLE_FORM_URL = "https://forms.gle/cuoJy7uJF4r2ewMg9";
const KAKAO_OPENCHAT_URL = "https://open.kakao.com/o/sSDeVvGg";

export default function ServiceIntroductionComponent() {
  return (
    <Card
      variant="outlined"
      sx={{
        margin: "20px 0",
        padding: "15px 15px",
        minHeight: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {/* 제목 */}
        <Stack sx={{ paddingBottom: "10px" }}>
          <Typography variant="h5">JUMO 업데이트 소개</Typography>
          <Typography sx={{ fontSize: "12px", color: "gray" }}>
            v2.0.0
          </Typography>
        </Stack>

        {/* 본문 */}
        <Typography sx={{ fontSize: "15px" }}>
          주류 검색 및 테이스팅 노트 작성 기능, 카카오 로그인 기능이
          추가되었습니다.
        </Typography>
        {/* 본문 */}
        <Typography sx={{ fontSize: "15px" }}>
          <strong>주류 검색 기능</strong>
          <br />
          원하는 주류를 검색해 정보를 확인하고, 다른 사용자의 테이스팅 리뷰를
          조회할 수 있습니다.
        </Typography>
        {/* 본문 */}
        <Typography sx={{ fontSize: "15px" }}>
          <strong>테이스팅 노트 작성 기능</strong>
          <br />
          카카오 로그인을 완료하면, 직접 테이스팅 노트를 작성할 수 있습니다! AI
          기반의 테이스팅 노트 추천 기능을 활용해 노트를 작성해보세요. 작성한
          노트는 주류 페이지와 마이 페이지에서 확인하실 수 있습니다.
        </Typography>
        {/* 본문 3 */}
        <Typography sx={{ fontSize: "15px" }}>
          서비스 사용 중에 불편하셨던 부분, 원하시는 기능 등을 하단 링크의
          Google Form을 통해 알려주시면 반영하여 개선해가도록 하겠습니다. 또한
          카카오톡 오픈채팅방을 통해서 저희 팀과 지속적으로 소통하실 수 있으니
          많은 의견 부탁드립니다!
        </Typography>
      </CardContent>

      {/* 링크 버튼 */}
      <CardActions
        sx={{
          padding: "5px 10px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Link href={GOOGLE_FORM_URL}>
          <Chip
            avatar={<Avatar alt="google logo" src="/Google_logo.png" />}
            label="의견 제출하기"
            sx={{ fontSize: "12px" }}
          />
        </Link>
        <Link href={KAKAO_OPENCHAT_URL}>
          <Chip
            avatar={<Avatar alt="kakaotalk logo" src="/KakaoTalk_logo.svg" />}
            label="오픈채팅방 바로가기"
            sx={{ fontSize: "12px" }}
          />
        </Link>
      </CardActions>
    </Card>
  );
}
