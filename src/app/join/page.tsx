"use client";

import SelectRegion from "@/components/SelectRegion/SelectRegion";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function JoinPage() {
  const [region, setRegion] = useState<String>();

  const regionChange = (newRegion: String | undefined) => {
    setRegion(newRegion);
  };

  const joinButtonClicked = () => {
    if (!region) console.log("지역을 선택해주세요");
    else console.log(region);
  };

  return (
    <>
      <SelectRegion onChange={regionChange} />
      <Button variant="contained" onClick={joinButtonClicked}>
        회원가입하기
      </Button>
    </>
  );
}
