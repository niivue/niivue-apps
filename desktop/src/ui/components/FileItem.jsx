import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export function FileItem({
    url, 
    name,
    index,
    active=false, 
    visible=true,
    onSetVisibility=()=>{}, 
    onSetActive=()=>{},
    ...props 
}){

    function toggleVisibility(){
        onSetVisibility(index, visible === 1.0 ? 0.0 : 1.0)
    }

    function toggleActive(){
        onSetActive(name, !active)
    }

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: '100%',
            width: '100%',
            // background color is very light blue if active
            backgroundColor: active ? '#E6F0FF' : '#F8F8F8',
            ...props
        }}
        >
            <IconButton onClick={toggleVisibility}>
                {visible === 0 ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <Typography
                sx={{
                    marginLeft: '8px',
                }}
                onClick={toggleActive}
            >
                {name}
            </Typography>
        </div>
    )
}