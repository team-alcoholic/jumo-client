"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import styles from "../style/selectRegion.module.css"


const url = "localhost:8080/api/v1";

interface Region {
  admcd: String;
  admnm: String;
}
interface RegionOption {
  label: String;
  admcd: String;
}

export default function SelectRegion() {
  const [majorList, setMajorList] = useState<RegionOption[]>([]);
  const [middleList, setMiddleList] = useState<RegionOption[]>([]);
  const [minorList, setMinorList] = useState<RegionOption[]>([]);

  const [major, setMajor] = useState<RegionOption|null>(null);
  const [middle, setMiddle] = useState<RegionOption|null>(null);
  const [minor, setMinor] = useState<RegionOption|null>(null);

  useEffect(() => {
    const getMajorRegionList = async () => {
      const result = await fetch(`http://${url}/region/majorList`);
      const json: Region[] = await result.json();
      const majorList = json.map((data) => { 
        const newData = { label: data.admnm, admcd: data.admcd }
        return newData;
      });
      setMajorList(majorList);
    }
    getMajorRegionList();
  }, []);
  
  useEffect(() => {
    const getMiddleRegionList = async () => {
      if (!major) setMiddleList([]);
      else {
        const result = await fetch(`http://${url}/region/subList/${major.admcd}`);
        const json: Region[] = await result.json();
        const middleList = json.map((data) => {
          const newData = { label: data.admnm, admcd: data.admcd };
          return newData;
        });
        setMiddleList(middleList);
      }
    }
    setMiddle(null);
    getMiddleRegionList();
  }, [major]);

  useEffect(() => {
    const getMinorRegionList = async () => {
      if (!middle) setMinorList([]);
      else {
        const result = await fetch(`http://${url}/region/subList/${middle.admcd}`);
        const json: Region[] = await result.json();
        const minorList = json.map((data) => {
          const newData = { label: data.admnm, admcd: data.admcd };
          return newData;
        });
        setMinorList(minorList);
      }
    }
    setMinor(null);
    getMinorRegionList();
  }, [middle]);

  // useEffect(() => { console.log(major, middle, minor); }, [major, middle, minor]);


  return (
    <Box className={styles.container}>

      <span>활동 지역을 선택해주세요</span>

      <Autocomplete
        options={majorList}
        renderInput={(params) => <TextField {...params} label="시/도" />}
        onChange={(event, value) => { setMajor(value); }}
        value={major}
      />

      <Autocomplete
        options={middleList}
        renderInput={(params) => <TextField {...params} label="시/군/구" />}
        onChange={(event, value) => { setMiddle(value); }}
        value={middle}
      />

      <Autocomplete
        options={minorList}
        renderInput={(params) => <TextField {...params} label="읍/면/동" />}
        onChange={(event, value) => { setMinor(value); }}
        value={minor}
      />

      

    </Box>
  );
}