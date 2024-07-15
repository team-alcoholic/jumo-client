"use client";

import * as React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleKakaoLogin = () => {
        router.push('/api/v1/oauth2/authorization/kakao');
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                textAlign: 'center',
            }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    주모에 오신 것을 환영합니다!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    간단하게 로그인하고 다양한 서비스를 즐겨보세요.
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2, backgroundColor: '#FEE500', color: '#000' }}
                onClick={handleKakaoLogin}
            >
                카카오로 로그인하기
            </Button>
        </Container>
    );
}