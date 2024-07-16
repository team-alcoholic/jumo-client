import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useEmblaCarousel from 'embla-carousel-react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

interface ImageSliderProps {
    images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
    const theme = useTheme();
    const [emblaRef, embla] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSelect = useCallback(() => {
        if (!embla) return;
        setSelectedIndex(embla.selectedScrollSnap());
    }, [embla]);

    useEffect(() => {
        if (!embla) return;
        embla.on('select', handleSelect);
    }, [embla, handleSelect]);

    const handleNext = () => {
        if (embla) embla.scrollNext();
    };

    const handleBack = () => {
        if (embla) embla.scrollPrev();
    };

    return (
        <Box sx={{ maxWidth: 400, flexGrow: 1, mx: 'auto' }}>
            <Typography variant="body2" align="right" gutterBottom>
                이미지 {selectedIndex + 1}/{images.length}
            </Typography>
            <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
                <Box sx={{ display: 'flex' }}>
                    {images.map((src, index) => (
                        <Box key={index} sx={{ minWidth: '100%', position: 'relative', height: 255 }}>
                            <Image src={src} alt={`image ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                {images.map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: index === selectedIndex ? 'primary.main' : 'grey.400',
                            mx: 0.5,
                        }}
                    />
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button size="small" onClick={handleBack} disabled={selectedIndex === 0}>
                    <KeyboardArrowLeft />
                    Back
                </Button>
                <Button size="small" onClick={handleNext} disabled={selectedIndex === images.length - 1}>
                    Next
                    <KeyboardArrowRight />
                </Button>
            </Box>
        </Box>
    );
};

export default ImageSlider;