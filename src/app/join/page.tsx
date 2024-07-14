"use client"

import SelectRegion from "@/component/selectRegion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../../style/join.module.css";
import { useState } from "react";


export default function JoinPage() {
  const [region, setRegion] = useState<String>();

  const regionChange = (newRegion: String|undefined) => {
    setRegion(newRegion);
  }

  const joinButtonClicked = () => {
    if (!region) console.log("지역을 선택해주세요");
    else console.log(region);
  }

  return (
    <Box className={styles.container}>

      <Box className={styles.header}>
        <h1>JUMO</h1>
        <span>당신이 찾던 완벽한 주류모임, 주모</span>
      </Box>

      <SelectRegion onChange={regionChange} />

      <Button variant="contained" onClick={joinButtonClicked}>회원가입하기</Button>

    </Box>
  );
}