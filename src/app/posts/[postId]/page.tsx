import {Box, Typography, Button, Chip, Container, Link, IconButton, Card, CardContent, Alert,Grid} from '@mui/material';
import { StyledBox, StyledChip, Header, BackButton, HighlightBox, Highlight, RedText } from './StyledComponents';
import ImageSlider from '../../../component/ImageSlider';
import Map from '../../../component/Map';
import {ArrowBack, Event, Place, TextSnippet, Liquor, Payment,People} from '@mui/icons-material';
import {formatPrice,formatDate} from "@/utils/format";

const DEFAULT_MESSAGE = <RedText>직접 확인 필요</RedText>;

const EXTERNAL_SERVICE_MESSAGE = "주모가 아닌 외부 커뮤니티에서 진행하는 주류 모임 입니다. 해당 커뮤티티에서 진행해주세요. (하단에 링크 제공) 해당 커뮤니티 운영 정책에 따라 회원가입 및 추가 절차가 필요할 수 있습니다. 또한 정보가 실제 게시물 정보와 다를 수 있으니 직접 확인해보셔야 합니다.";


const testData = {
    images: [
        "https://jinblog.imtrue.co.kr/wp-content/uploads/2024/05/%EC%BD%94%EA%B2%8C%EC%9D%B4-1-optimized.jpg",
        "https://blog.kakaocdn.net/dn/pyTxL/btsHfYncNdI/juuRga976YHpkUU4jmqbB1/img.png",
        "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/870/05917009d23b9fa8d8279585d2d05e95_res.jpeg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDWI4yr32mbQMhOLp8TZdBKcZsHeSNXWPBOA&s",
        "https://jinblog.imtrue.co.kr/wp-content/uploads/2024/05/%EC%BD%94%EA%B2%8C%EC%9D%B4-1-optimized.jpg",
    ],
    name: "일본 위스키 모임",
    meeting_at: "2024.07.06 18:30",
    fixed_at: "2024.07.04 23:59",
    region: "강남구",
    place: "서울 강남구 논현로86길 32 삼우빌딩 1층 마구로젠",
    participants_min: 4,
    participants_max: 12,
    liquors: ["위스키", "꼬냑"],
    payment: 50000,
    payment_method: "선입금",
    byob: true,
    byob_min: 300000,
    byob_max: 300000,
    description: "안녕하세요! 위스키 블라인드 테이스팅 모임을 모집합니다. 최대 12명까지 인원을 모집할 예정이고, 역삼역 근처에서 오시는 분께서 선착순 예약하실 수 있습니다. 모임 뒤, 간단한 치즈와 아이스 브레이킹을 본 멤버들과 함께 하고 온전히 위스키에 집중할 예정입니다. 재미있고 유익한 모임이 될 것 같습니다. 신청 30미리씩 마실 예정입니다. 많은 참여 바랍니다!",
    external_service: "네이버 카페",
    external_link: "https://cafe.naver.com/jumo",
};

const testDataNull = {
    images: [
        "https://jinblog.imtrue.co.kr/wp-content/uploads/2024/05/%EC%BD%94%EA%B2%8C%EC%9D%B4-1-optimized.jpg",
        "https://blog.kakaocdn.net/dn/pyTxL/btsHfYncNdI/juuRga976YHpkUU4jmqbB1/img.png",
        "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/870/05917009d23b9fa8d8279585d2d05e95_res.jpeg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDWI4yr32mbQMhOLp8TZdBKcZsHeSNXWPBOA&s",
        "https://jinblog.imtrue.co.kr/wp-content/uploads/2024/05/%EC%BD%94%EA%B2%8C%EC%9D%B4-1-optimized.jpg",
    ],
    name: "일본 위스키 모임",
    meeting_at: null,
    fixed_at: null,
    region: null,
    place: null,
    participants_min: null,
    participants_max: null,
    liquors: [],
    payment: null,
    payment_method: null,
    byob: null,
    byob_min: null,
    byob_max: null,
    description: "안녕하세요! 위스키 블라인드 테이스팅 모임을 모집합니다. 최대 12명까지 인원을 모집할 예정이고, 역삼역 근처에서 오시는 분께서 선착순 예약하실 수 있습니다. 모임 뒤, 간단한 치즈와 아이스 브레이킹을 본 멤버들과 함께 하고 온전히 위스키에 집중할 예정입니다. 재미있고 유익한 모임이 될 것 같습니다. 신청 30미리씩 마실 예정입니다. 많은 참여 바랍니다!",
    external_service: null,
    external_link: "https://cafe.naver.com/jumo",
};

const PostPage = () => {
    const {
        images,
        name,
        meeting_at,
        fixed_at,
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
        external_link
    } = testData;

    return (
        <Container maxWidth="sm" sx={{ padding: 0 }}>
            <Header>
                <BackButton>
                    <ArrowBack />
                </BackButton>
                <Typography variant="h4">JUMO</Typography>
            </Header>
            <StyledBox>
                <ImageSlider images={images} />
                <Typography my={2} variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {name || DEFAULT_MESSAGE}
                </Typography>
                <Box my={2}>
                    {region && <StyledChip label={region} />}
                    {liquors && liquors.map((liquor, index) => (
                        <StyledChip key={index} label={liquor} />
                    ))}



                </Box>
                {external_service!=="주모" && <Alert severity="error">
                    {EXTERNAL_SERVICE_MESSAGE}
                </Alert>}
                <HighlightBox>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <Event sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                        일정
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <Highlight>모임 시작</Highlight>
                        {meeting_at ? `${formatDate(meeting_at)}` : DEFAULT_MESSAGE}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <Highlight>모집 마감</Highlight>
                        {fixed_at ? `${formatDate(fixed_at)}` : DEFAULT_MESSAGE}
                    </Typography>
                </HighlightBox>
                <HighlightBox>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <Payment sx={{ verticalAlign: 'middle', marginRight: 1 }} />
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
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <Liquor sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                        주류 정보
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <Highlight> 주류 종류 </Highlight>{liquors && liquors.length > 0 ? liquors.join(", ") : DEFAULT_MESSAGE}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <Highlight> 모임 형태 </Highlight>{byob ? "비욥 (개인 보틀 지참 필수)": "주최자 제공"}
                    </Typography>
                    {byob &&
                        <Typography variant="body2" gutterBottom>
                            <Highlight> 주류 가격 </Highlight>{payment ? `${formatPrice(byob_min)}원 이상` : DEFAULT_MESSAGE}
                        </Typography>
                    }
                </HighlightBox>

                <HighlightBox>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <People sx={{ verticalAlign: 'middle', marginRight: 1 }} />
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
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <Place sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                        장소
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {place ? (
                            <>
                                <Map place={place} />
                                <Highlight> 장소 </Highlight>{place}
                            </>
                        ) : (
                            DEFAULT_MESSAGE
                        )}
                    </Typography>
                </HighlightBox>

                <HighlightBox>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <TextSnippet sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                        상세 설명
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {description || DEFAULT_MESSAGE}
                    </Typography>
                </HighlightBox>

                <Button variant="contained" fullWidth color="primary" sx={{ marginTop: 2 }}>
                    해당 커뮤니티로 이동
                </Button>
            </StyledBox>
        </Container>
    );
};

export default PostPage;