import { Box, Typography, Button, Container, Alert } from "@mui/material";
import {
  StyledBox,
  StyledChip,
  Header,
  HighlightBox,
  Highlight,
  RedText,
} from "./StyledComponents";
import ImageSlider from "../../../component/ImageSlider";
import {
  Event,
  Place,
  TextSnippet,
  Liquor,
  Payment,
  People,
} from "@mui/icons-material";
import { formatPrice, formatDate } from "@/utils/format";

const DEFAULT_MESSAGE = <RedText>직접 확인 필요</RedText>;
const EXTERNAL_SERVICE_MESSAGE =
  "주모가 아닌 외부 커뮤니티에서 진행하는 주류 모임 입니다. 해당 커뮤티티에서 진행해주세요. (하단에 링크 제공) 해당 커뮤니티 운영 정책에 따라 회원가입 및 추가 절차가 필요할 수 있습니다. 또한 정보가 실제 게시물 정보와 다를 수 있으니 직접 확인해보셔야 합니다.";

interface ResponseData {
  images: string[];
  name: string;
  meeting_at: string | null;
  fix_at: string | null;
  region: string | null;
  place: string | null;
  participants_min: number | null;
  participants_max: number | null;
  liquors: string | null;
  payment: number | null;
  payment_method: string | null;
  byob: boolean;
  byob_min: number | null;
  byob_max: number | null;
  description: string;
  external_service: string | null;
  external_link: string;
}

// 데이터를 가져오는 함수
// 1분마다 캐시를 업데이트
async function fetchData(mId: string) {
  const res = await fetch(`${process.env.API_BASE_URL}/meetings/${mId}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data: ResponseData = await res.json();
  return data;
}
export default async function PostPage({
  params,
}: {
  params: { mId: string };
}) {
  const data = await fetchData(params.mId);

  const {
    images,
    name,
    meeting_at,
    fix_at,
    region,
    place,
    participants_min,
    participants_max,
    liquors,
    payment,
    payment_method,
    byob,
    byob_min,
    byob_max,
    description,
    external_service,
    external_link,
  } = data;

  return (
    <Container maxWidth="sm" sx={{ padding: 0 }}>
      <Header>
        <Typography variant="h4">JUMO</Typography>
      </Header>
      <StyledBox>
        <ImageSlider images={images} />
        <Typography
          my={2}
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {name || DEFAULT_MESSAGE}
        </Typography>
        <Box my={2}>
          {region && <StyledChip label={region} />}
          {liquors &&
            liquors
              .split(",")
              .map((liquor, index) => (
                <StyledChip key={index} label={liquor.trim()} />
              ))}{" "}
        </Box>
        {external_service !== "주모" && (
          <Alert severity="error">{EXTERNAL_SERVICE_MESSAGE}</Alert>
        )}
        <HighlightBox>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            <Event sx={{ verticalAlign: "middle", marginRight: 1 }} />
            일정
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight>모임 시작</Highlight>
            {meeting_at ? `${formatDate(meeting_at)}` : DEFAULT_MESSAGE}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight>모집 마감</Highlight>
            {fix_at ? `${formatDate(fix_at)}` : DEFAULT_MESSAGE}
          </Typography>
        </HighlightBox>
        <HighlightBox>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            <Payment sx={{ verticalAlign: "middle", marginRight: 1 }} />
            회비
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight>회비 가격</Highlight>
            {payment ? `${formatPrice(payment)}원` : DEFAULT_MESSAGE}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight>지불 방식</Highlight>
            {payment_method || DEFAULT_MESSAGE}
          </Typography>
        </HighlightBox>
        <HighlightBox>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            <Liquor sx={{ verticalAlign: "middle", marginRight: 1 }} />
            주류 정보
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight> 주류 종류 </Highlight>
            {liquors ? liquors : DEFAULT_MESSAGE}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight> 모임 형태 </Highlight>
            {byob ? "비욥 (개인 보틀 지참 필수)" : "주최자 제공"}
          </Typography>
          {byob && (
            <Typography variant="body2" gutterBottom>
              <Highlight> 주류 가격 </Highlight>
              {payment
                ? `${byob_min && formatPrice(byob_min)}원 이상`
                : DEFAULT_MESSAGE}
            </Typography>
          )}
        </HighlightBox>
        <HighlightBox>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            <People sx={{ verticalAlign: "middle", marginRight: 1 }} />
            인원
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight>최대 인원</Highlight>
            {participants_max ? `${participants_max}명` : DEFAULT_MESSAGE}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Highlight>최소 인원</Highlight>
            {participants_min ? `${participants_min}명` : DEFAULT_MESSAGE}
          </Typography>
        </HighlightBox>
        <HighlightBox>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            <Place sx={{ verticalAlign: "middle", marginRight: 1 }} />
            장소
          </Typography>
          <Typography variant="body2" gutterBottom>
            {place ? (
              <>
                {/*<Map place={place} />*/}
                <Highlight> 장소 </Highlight>
                {place}
              </>
            ) : (
              DEFAULT_MESSAGE
            )}
          </Typography>
        </HighlightBox>
        <HighlightBox>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            <TextSnippet sx={{ verticalAlign: "middle", marginRight: 1 }} />
            상세 설명
          </Typography>
          <Typography variant="body1" paragraph>
            {description || DEFAULT_MESSAGE}
          </Typography>
        </HighlightBox>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ marginTop: 2 }}
          href={external_link}
        >
          해당 커뮤니티로 이동
        </Button>
      </StyledBox>
    </Container>
  );
}