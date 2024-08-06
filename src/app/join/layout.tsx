import React from "react";
import { ContainerBox, HeaderBox } from "./StyledComponent";

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContainerBox>
      <HeaderBox>
        <h1>JUMO</h1>
        <span>당신이 찾던 완벽한 주류모임, 주모</span>
      </HeaderBox>
      {children}
    </ContainerBox>
  );
}