import SelectRegion from "@/component/selectRegion";
import { Box } from "@mui/material";
import styles from "../../style/join.module.css";


export default async function JoinPage() {
  return (
    <Box className={styles.container}>

      <Box className={styles.header}>
        <h1>JUMO</h1>
        <span>회원가입</span>
      </Box>

      <SelectRegion />

    </Box>
  );
}