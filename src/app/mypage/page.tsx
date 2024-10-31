"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MyPageContentsComponent from "@/components/MyPageContentsComponent/MyPageContentsComponent";

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/users`,
          {
            method: "GET",
            credentials: "include", // 쿠키 포함
          }
        );

        if (response.status === 401) {
          setIsLoggedIn(false);
          const redirectUrl = window.location.href;
          router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`);
        } else {
          setIsLoggedIn(true);
          setUser(await response.json());
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
        router.push("/login");
      }
    };
    setCurrentUrl(window.location.href);
    checkAuth();
  }, [router]);

  // 페이지: 로그인 여부 로딩 중
  if (isLoggedIn === null || (isLoggedIn === true && user === null)) return;

  // 페이지: 로그인 되어 있는 경우
  if (user) {
    return <MyPageContentsComponent user={user} />;
  }
}
