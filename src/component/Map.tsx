import React from 'react';
import { Box } from '@mui/material';

interface MapProps {
    place: string;
}

const Map: React.FC<MapProps> = ({ place }) => {
    const src = `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;

    return (
        <Box component="iframe" src={src} width="100%" height="300px" border="0" />
    );
};

export default Map;