'use client'

import React from 'react';
import { Box, Typography, Button, Chip, Grid, Avatar, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageSlider from '../../../component/ImageSlider';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
}));

const StyledChip = styled(Chip)({
    margin: '4px',
});

const PostPage = () => {
    return (
        <Container maxWidth="md">
            <StyledBox>
                <Typography variant="h6" component="h1" gutterBottom>
                    JUMO
                </Typography>

                <ImageSlider />

                <Typography variant="h5" component="h2" gutterBottom>
                    일본 위스키 모임
                </Typography>

                <Box my={2}>
                    <StyledChip label="강남구" />
                    <StyledChip label="회비5만원 / 선착순" />
                    <StyledChip label="최소4명" />
                    <StyledChip label="20대만 이상" />
                    <StyledChip label="1부" />
                    <StyledChip label="30미만" />
                    <StyledChip label="블라인드" />
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                    모임 일정
                </Typography>
                <Typography variant="body2" gutterBottom>
                    모임 시작 2024.07.06 18:30 ~ 22:30
                </Typography>
                <Typography variant="body2" gutterBottom>
                    모임 마감 2024.07.04 23:59 약정 32분전
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    모임 장소
                </Typography>



                <Typography variant="body1" paragraph>
                    안녕하세요! 위스키 블라인드 테이스팅 모임을 모집합니다.
                    최대 12명까지 인원을 모집할 예정이고, 역삼역 근처에서 오시는 분께서 선착순 예약하실 수 있습니다.
                    모임 뒤, 간단한 치즈와 아이스 브레이킹을 본 멤버들과 함께 하고 온전히 위스키에 집중할 예정입니다.
                    재미있고 유익한 모임이 될 것 같습니다. 신청 30미리씩 마실 예정입니다.
                    많은 참여 바랍니다!
                </Typography>

                <Button variant="contained" fullWidth color="primary">
                    참가 신청
                </Button>
            </StyledBox>
        </Container>
    );
};

export default PostPage;