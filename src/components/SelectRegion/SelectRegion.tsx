"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { SelectRegionContainer } from "./StyledComponent";

interface Region {
  admcd: String;
  admnm: String;
}
interface RegionOption {
  label: String;
  admcd: String;
}
interface Props {
  onChange: (region: String | undefined) => void;
}

export default function SelectRegion({ onChange }: Props) {
  const [majorList, setMajorList] = useState<RegionOption[]>([]);
  const [middleList, setMiddleList] = useState<RegionOption[]>([]);
  const [minorList, setMinorList] = useState<RegionOption[]>([]);

  const [major, setMajor] = useState<RegionOption | null>(null);
  const [middle, setMiddle] = useState<RegionOption | null>(null);
  const [minor, setMinor] = useState<RegionOption | null>(null);

  useEffect(() => {
    const getMajorRegionList = async () => {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/region/majorList`,
      );
      const json: Region[] = await result.json();
      const majorList = json.map((data) => {
        const newData = { label: data.admnm, admcd: data.admcd };
        return newData;
      });
      setMajorList(majorList);
    };
    getMajorRegionList();
  }, []);

  useEffect(() => {
    const getMiddleRegionList = async () => {
      setMiddle(null);
      setMiddleList([]);
      if (major) {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/region/subList/${major.admcd}`,
        );
        const json: Region[] = await result.json();
        const middleList = json.map((data) => {
          const newData = { label: data.admnm, admcd: data.admcd };
          return newData;
        });
        setMiddleList(middleList);
      }
    };
    getMiddleRegionList();
  }, [major]);

  useEffect(() => {
    const getMinorRegionList = async () => {
      setMinor(null);
      setMinorList([]);
      if (middle) {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/region/subList/${middle.admcd}`,
        );
        const json: Region[] = await result.json();
        const minorList = json.map((data) => {
          const newData = { label: data.admnm, admcd: data.admcd };
          return newData;
        });
        setMinorList(minorList);
      }
    };
    getMinorRegionList();
  }, [middle]);

  useEffect(() => {
    if (minor) onChange(minor.admcd);
    else if (middle) onChange(middle.admcd);
    else if (major) onChange(major.admcd);
  }, [major, middle, minor, onChange]);


  return (
    <SelectRegionContainer>
      <span>활동 지역을 선택해주세요</span>

      <Autocomplete
        options={majorList}
        renderInput={(params) => <TextField {...params} label="시/도" />}
        onChange={(event, value) => {
          setMajor(value);
        }}
        value={major}
      />

      <Autocomplete
        options={middleList}
        renderInput={(params) => <TextField {...params} label="시/군/구" />}
        onChange={(event, value) => {
          setMiddle(value);
        }}
        value={middle}
      />

      <Autocomplete
        options={minorList}
        renderInput={(params) => <TextField {...params} label="읍/면/동" />}
        onChange={(event, value) => {
          setMinor(value);
        }}
        value={minor}
      />
    </SelectRegionContainer>
  );
}
