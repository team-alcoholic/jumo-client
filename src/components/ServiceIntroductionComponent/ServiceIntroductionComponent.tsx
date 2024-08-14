import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Link from "next/link";

const GOOGLE_FORM_URL = "https://forms.gle/cuoJy7uJF4r2ewMg9";
const KAKAO_OPENCHAT_URL = "https://open.kakao.com/o/sSDeVvGg";

// const onClickGoogle = () => {
//   const url = "https://forms.gle/cuoJy7uJF4r2ewMg9";
//   window.open(url, "_blank");
// };
// const onClickKakao = () => {
//   const url = "https://open.kakao.com/o/sSDeVvGg";
//   window.open(url, "_blank");
// };

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
        <Typography sx={{ fontSize: "15px" }}>
          JUMO(주모)는 원하는 주류 모임을 쉽게 찾기 위한 서비스로, 각종
          커뮤니티에서 만들어지고 있는 주류 모임들을 한눈에 찾아볼 수 있습니다.
        </Typography>
        <Typography sx={{ fontSize: "15px" }}>
          서비스 사용 중에 불편하셨던 부분들을 하단 링크의 Google Form을 통해
          알려주시면 반영하여 개선해가도록 하겠습니다. 또한 카카오톡
          오픈채팅방을 통해서 저희 팀과 지속적으로 소통하실 수 있으니 많은 의견
          부탁드립니다!
        </Typography>
      </CardContent>
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

// const CardContainer = styled(Card)({
//   margin: "20px 0",
//   padding: "15px 15px",
//   minHeight: "100px",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "5px",
// });

// const UserFeedbackCardContent = styled(CardContent)({
//   display: "flex",
//   flexDirection: "column",
//   gap: "15px",
// });

// const UserFeedbackCardActions = styled(CardActions)({
//   padding: "5px 10px",
//   display: "flex",
//   flexDirection: "row",
//   gap: "10px",
// });

// const IntroductionText = styled(Typography)({
//   fontSize: "15px",
// });

// const LinkChip = styled(Chip)({
//   fontSize: "12px",
// });
