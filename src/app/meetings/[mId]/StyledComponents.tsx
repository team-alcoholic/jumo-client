"use client";

import { styled } from '@mui/material/styles';
import { Box, Chip, IconButton, Card } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    marginTop: "20px"
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
    margin: '4px',
    color: 'black',
    fontWeight: 'bold',
}));

export const BackButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    left: theme.spacing(2),
}));

export const HighlightBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
}));

export const CardContainer = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

export const Highlight = styled('span')(({ theme }) => ({
    display: 'inline-block',
    backgroundColor: 'lightgreen',
    color: 'black',
    borderRadius: '4px',
    padding: '0 4px',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    fontSize: 'inherit',
    fontWeight: 'bold',
}));

export const RedText = styled('span')({
    color: 'red',
    fontWeight: 'bold',
});