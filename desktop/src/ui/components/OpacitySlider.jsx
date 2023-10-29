import React from "react"
import Slider from "@mui/material/Slider"
import Typography from "@mui/material/Typography"

export function OpacitySlider({ children, ...props }){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '50px',
            gap: '4px',
            // marginLeft: '8px',
            // marginRight: '8px',
            ...props
        }}
        >
            <Typography
                variant="body"
            >
                Opacity
            </Typography>
            <Slider
                id="opacity-slider"
                label="Opacity"
                min={0}
                max={1}
                step={0.05}
                size="small"
                valueLabelDisplay="auto"
            />
        </div>
    )
}