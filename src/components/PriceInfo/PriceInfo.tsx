"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import axios from "axios";

interface PriceInfoProps {
  liquorName: string;
  store?:
    | "dailyshot"
    | "traders"
    | "mukawa"
    | "cu"
    | "getju"
    | "lottemart"
    | "emart"
    | "biccamera";
}

const storeDisplayName = {
  dailyshot: "데일리샷",
  traders: "트레이더스",
  mukawa: "무카와",
  cu: "CU",
  getju: "겟주",
  lottemart: "롯데마트",
  emart: "이마트",
  biccamera: "빅카메라",
};

const PriceInfo: React.FC<PriceInfoProps> = ({
  liquorName,
  store = "dailyshot",
}) => {
  const [priceInfo, setPriceInfo] = useState<
    { name: string; price: number; url?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPriceInfo = async () => {
      if (!liquorName) {
        console.log("주류 이름이 제공되지 않아 검색을 건너뜁니다.");
        return;
      }

      setIsLoading(true);
      try {
        console.log(`${store}의 가격 정보를 가져오는 중:`, liquorName);
        const fetchUrl = `/external-api/price-search?q=${encodeURIComponent(liquorName)}&store=${store}`;
        console.log("요청 URL:", fetchUrl);

        const response = await axios.get(fetchUrl);

        if (response.status !== 200) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }

        const data = response.data;
        console.log("가져온 데이터:", data);

        setPriceInfo(data || []);
      } catch (error) {
        console.error(`${store} 가격 정보를 가져오는 데 실패했습니다:`, error);
        setPriceInfo([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceInfo();
  }, [liquorName, store]);

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton animation="wave" height={24} />
          </TableCell>
          <TableCell align="right">
            <Skeleton animation="wave" height={24} width={100} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {storeDisplayName[store]} 가격 정보
      </Typography>
      {store !== "traders" && store !== "lottemart" && store !== "emart" && (
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          클릭시 상세 페이지로 이동합니다.
          {(store === "mukawa" || store === "biccamera") &&
            " 일본 사이트에서 정보를 가져와 번역하기에 오래 걸립니다."}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>상품명</TableCell>
              <TableCell align="right">가격</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : priceInfo.length > 0 ? (
              priceInfo.map((item) => (
                <TableRow
                  key={item.name}
                  hover={!!item.url}
                  onClick={() => {
                    if (item.url) {
                      window.open(item.url, "_blank");
                    }
                  }}
                  sx={item.url ? { cursor: "pointer" } : {}}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="right">
                    {store === "mukawa" || store === "biccamera"
                      ? `${item.price.toLocaleString()} 엔`
                      : `${item.price.toLocaleString()} 원`}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  가격 정보가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PriceInfo;
