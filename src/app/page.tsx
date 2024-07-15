"use client";
import * as React from 'react';
import { Container, Typography, Button, AppBar, Toolbar, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

interface Profile {
  profileNickname: string;
  profileImage: string;
}

const MainContainer = styled.main`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const AvatarStyle = styled(Avatar)`
  width: 100px;
  height: 100px;
`;

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users', { withCredentials: true });
        setProfile(response.data);
      } catch (error) {
        console.error("User not logged in or error fetching profile", error);
        setProfile(null);
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/logout', {}, { withCredentials: true });
      setProfile(null);
      window.location.href = 'http://localhost:3000/'; // 로그아웃 후 메인 페이지로 이동
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = 'http://localhost:3000/login'; // 로그인 페이지로 이동
  };

  return (
      <Container maxWidth="lg">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              주모 홈페이지
            </Typography>
            {profile ? (
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            ) : (
                <Button color="inherit" onClick={handleLoginRedirect}>Login</Button>
            )}
          </Toolbar>
        </AppBar>

        <MainContainer>
          {profile ? (
              <>
                <AvatarStyle
                    alt={profile.profileNickname}
                    src={profile.profileImage || '/default-profile.png'}
                />
                <Typography variant="h5" component="h2">
                  {profile.profileNickname}
                </Typography>
              </>
          ) : (
              <Typography variant="h2" component="h1" gutterBottom>
                주모 홈페이지
              </Typography>
          )}
        </MainContainer>
      </Container>
  );
}