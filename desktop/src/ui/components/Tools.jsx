import {useState, useEffect} from 'react'
import AddIcon from '@mui/icons-material/Add';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import DrawIcon from '@mui/icons-material/Draw';
import StraightenIcon from '@mui/icons-material/Straighten';
import ReplayIcon from '@mui/icons-material/Replay';

function ToolButton({icon, active, ...props}){
    // background color state
    const [bgColor, setBgColor] = useState('white')
    const [activeColor, setActiveColor] = useState('lightgray')
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '0px',
            minWidth: '0px',
            backgroundColor: active ? activeColor : bgColor,
            borderRadius: '5px',
            ...props
        }}
        onMouseEnter={() => setBgColor('lightgray')}
        onMouseLeave={() => setBgColor('white')}
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
                {/* crosshair only... right click does nothing */}
                <ToolButton icon={<AddIcon fontSize='large' sx={{color:'black'}} />} />
                {/* zoom/pan */}
                <ToolButton icon={<ZoomInIcon fontSize='large' />} />
                {/* windowing/intensity selection */}
                <ToolButton icon={<PhotoSizeSelectSmallIcon fontSize='large' />} />
                {/* draw mode */}
                <ToolButton icon={<DrawIcon fontSize='large' />} />
                {/* ruler */}
                <ToolButton icon={<StraightenIcon fontSize='large' />} />
                {/* reset */}
                <ToolButton icon={<ReplayIcon fontSize='large' />} />
            </ToolButtonGroup>
        
        </div>
    )
}