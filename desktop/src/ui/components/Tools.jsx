import {useState, useEffect} from 'react'
import AddIcon from '@mui/icons-material/Add';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import DrawIcon from '@mui/icons-material/Draw';
import StraightenIcon from '@mui/icons-material/Straighten';

function ToolButton({icon, ...props}){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '0px',
            minWidth: '0px',
            ...props
        }}
        >
            {icon}
        </div>
    )
}

function ToolButtonGroup({children, ...props}){
    return (
        <div
        style={{
            display: 'flex',
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '5px',
            margin: '8px',
            // padding: '5px',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            minHeight: '0px',
            ...props
        }}
        >
            {children}
        </div>
    )
}

export function Tools({...props }){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            // height: '100%',
            minWidth: '20px',
            flexGrow: 1,
            backgroundColor: 'black',
            alignContent: 'center',
            justifyContent: 'center',
            margin: '24px',
            minHeight: '0px',
            ...props
        }}
        >
            <ToolButtonGroup>
                <ToolButton icon={<AddIcon fontSize='large' />} />
                <ToolButton icon={<ZoomInIcon fontSize='large' />} />
                <ToolButton icon={<PhotoSizeSelectSmallIcon fontSize='large' />} />
                <ToolButton icon={<DrawIcon fontSize='large' />} />
                <ToolButton icon={<StraightenIcon fontSize='large' />} />
            </ToolButtonGroup>
        
        </div>
    )
}