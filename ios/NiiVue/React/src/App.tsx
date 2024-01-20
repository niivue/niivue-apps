import React from 'react'
import { Niivue, SLICE_TYPE } from '@niivue/niivue';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// drag (cursor) icons
import DragModeIcon from '@mui/icons-material/AdsClick'; // speed dial icon
import MeasureIcon from '@mui/icons-material/Straighten'; // measure
import ZoomPanIcon from '@mui/icons-material/ZoomIn'; // pan/zoom
import ContrastIcon from '@mui/icons-material/Contrast'; // contrast (default)
// draw tools icons
import PencilIcon from '@mui/icons-material/Create'; // pencil icon for speed dial
import ColorCircleIcon from '@mui/icons-material/Circle'; // circle icon for pencil color
import EraserIcon from '@mui/icons-material/PanoramaFishEye'; // open circle for eraser
import FillPenIcon from '@mui/icons-material/FormatColorFill'; // fill icon
import OpacityIcon from '@mui/icons-material/Opacity'; // opacity icon
// view mode tools icons
import ViewModeIcon from '@mui/icons-material/GridView'; // view mode speed dial icon
// use text for axial, sagittal, coronal, and 3d
// use checkbox for toggle colorbar, radiological, world space, smooth
// saving and sharing icons
// import ShareIcon from '@mui/icons-material/Share'; // speed dial icon for saving and sharing
// import SaveDrawingIcon from '@mui/icons-material/SaveAlt'; // download drawing (save)
// import ScreenshotIcon from '@mui/icons-material/Wallpaper'; // screenshot
import './App.css'
// import { red } from '@mui/material/colors';

// const nv = new Niivue();

function App() {
  // canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const nvRef = React.useRef<Niivue>(new Niivue());
  const nv = nvRef.current;
  const backgroundColor = 'black'

  const [isFilled, setIsFilled] = React.useState(true)
  const [drawingOpacity, setDrawingOpacity] = React.useState(1)

  function handleAxialClick() {
    nv.setSliceType(SLICE_TYPE.AXIAL)
  }

  function handleCoronalClick() {
    nv.setSliceType(SLICE_TYPE.CORONAL)
  }

  function handleSagittalClick() {
    nv.setSliceType(SLICE_TYPE.SAGITTAL)
  }

  function handle3DClick() {
    nv.setSliceType(SLICE_TYPE.RENDER)
  }

  function handleMultiplanarClick() {
    nv.opts.multiplanarForceRender = true
    nv.setMultiplanarLayout(2) // 2x2
    nv.setSliceType(SLICE_TYPE.MULTIPLANAR)
  }

  function handleDragModeMeasure() {
    nv.opts.dragMode = nv.dragModes.measurement
  }

  function handleDragModeZoomPan() {
    nv.opts.dragMode = nv.dragModes.pan
  }

  function handleDragModeContrast() {
    nv.opts.dragMode = nv.dragModes.contrast
  }

  function handleRedClick() {
    nv.drawFillOverwrites = true
    nv.createEmptyDrawing()
    nv.setDrawingEnabled(true)
    nv.setPenValue(1, isFilled)
  }

  function handleGreenClick() {
    nv.setDrawingEnabled(true)
    nv.setPenValue(2, isFilled)
  }

  function handleBlueClick() {
    nv.setDrawingEnabled(true)
    nv.setPenValue(3, isFilled)
  }

  function handleYellowClick() {
    nv.setDrawingEnabled(true)
    nv.setPenValue(4, isFilled)
  }

  function handleCyanClick() {
    nv.setDrawingEnabled(true)
    nv.setPenValue(5, isFilled)
  }

  function handlePurpleClick() {
    nv.setDrawingEnabled(true)
    nv.setPenValue(6, isFilled)
  }

  function handleEraserClick() {
    nv.setDrawingEnabled(true)
    nv.setPenValue(0, isFilled)
  }

  function handleDrawingOffClick() {
    nv.setDrawingEnabled(false)
  }

  function handleDrawOpacityClick() {
    // toggle draw opacity between 0.5 and 1
    if (drawingOpacity === 1) {
      setDrawingOpacity(0.5)
    } else {
      setDrawingOpacity(1)
    }
  }

  function handleFillClick() {
    setIsFilled(!isFilled)
  }

  React.useEffect(() => {
    nv.setPenValue(nv.opts.penValue, isFilled)
  }, [isFilled])

  React.useEffect(() => {
    // nv.setDrawOpacity(drawingOpacity)
    nv.drawOpacity = drawingOpacity
    console.log('drawing opacity: ', drawingOpacity)
  }, [drawingOpacity])

  const viewModeActions = [
    { icon: null, name: 'axial', action: handleAxialClick },
    { icon: null, name: 'coronal', action: handleCoronalClick },
    { icon: null, name: 'sagittal', action: handleSagittalClick },
    { icon: null, name: 'grid', action: handleMultiplanarClick },
    { icon: null, name: '3D', action: handle3DClick }
  ];

  const dragModeActions = [
    { icon: <MeasureIcon/>, name: 'measure', action: handleDragModeMeasure },
    { icon: <ZoomPanIcon/>, name: 'zoom/pan', action: handleDragModeZoomPan },
    { icon: <ContrastIcon/>, name: 'contrast', action: handleDragModeContrast }
  ];

  const drawActions = [
    // off
    { icon: null, name: 'off', action: handleDrawingOffClick },
    // set pen value to red
    { icon: <ColorCircleIcon sx={{color: 'red'}}/>, name: 'red', action: handleRedClick},
    // green pen
    { icon: <ColorCircleIcon sx={{color: 'green'}}/>, name: 'green', action: handleGreenClick },
    // blue pen
    { icon: <ColorCircleIcon sx={{color: 'blue'}}/>, name: 'blue', action: handleBlueClick },
    // yellow pen
    { icon: <ColorCircleIcon sx={{color: 'yellow'}}/>, name: 'yellow', action: handleYellowClick },
    // cyan pen
    { icon: <ColorCircleIcon sx={{color: 'cyan'}}/>, name: 'cyan', action: handleCyanClick },
    // purple
    { icon: <ColorCircleIcon sx={{color: 'purple'}}/>, name: 'purple', action: handlePurpleClick },
    // eraser
    { icon: <EraserIcon sx={{color: 'black'}}/>, name: 'eraser', action: handleEraserClick },
    // fill mode
    { icon: <FillPenIcon/>, name: 'fill', action: handleFillClick },
    // draw opacity
    { icon: <OpacityIcon/>, name: 'opacity', action: handleDrawOpacityClick }
  ];

  const setup = async () => {
    // @ts-ignore
    await nv.attachToCanvas(canvasRef.current);
    await nv.loadVolumes([
      {url: 'https://niivue.github.io/niivue-demo-images/chris_t2.nii.gz'},
    ])
  };

  React.useEffect(() => {
    setup();
  }, []);

  return (
    <Container
      maxWidth={false}
      component='main'
      style={{
        display: 'flex',
        padding: '0',
        margin: '0',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        backgroundColor: backgroundColor
      }}

    >
      {/* canvas */}
      <Box
        style={{
          margin: '0',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          backgroundColor: backgroundColor
        }}
      >
        {/* no focus ring on canvas */}
        <canvas ref={canvasRef} className='no-focus' />
      </Box>
      {/* vertical tool buttons */}
      <Box
        style={{
          margin: '0',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '72px',
          backgroundColor: backgroundColor
        }}
      >
        {/* speed dial bottom */}
        <SpeedDial
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 8
          }}
          FabProps={{
            size: 'small',
          }}
          ariaLabel="view modes"
          icon={<ViewModeIcon/>}
          direction="left" // open left
        >
        {viewModeActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            FabProps={{'variant': 'extended'}}
            icon={
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onTouchEnd={action.action}
                onClick={action.action}
              >
                {action.icon}
                <Typography variant='body1' textTransform={'none'}>
                  {action.name}
                </Typography>
              </Box>
            }
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>

      {/* speed dial drag modes */}
      <SpeedDial
          sx={{
            position: 'absolute',
            bottom: 84,
            right: 8
          }}
          FabProps={{
            size: 'small',
          }}
          ariaLabel="view modes"
          icon={<DragModeIcon/>}
          direction="left" // open left
        >
        {dragModeActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            FabProps={{'variant': 'extended'}}
            icon={
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onTouchEnd={action.action}
                onClick={action.action}
              >
                {action.icon}
                {/* <Typography variant='body1' textTransform={'none'}>
                  {action.name}
                </Typography> */}
              </Box>
            }
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>

      {/* speed dial draw modes */}
      <SpeedDial
          sx={{
            position: 'absolute',
            bottom: 152,
            right: 8
          }}
          FabProps={{
            size: 'small',
          }}
          ariaLabel="draw modes"
          icon={<PencilIcon/>}
          direction="left" // open left
        >
        {drawActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            FabProps={{'variant': 'extended'}}
            icon={
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onTouchEnd={action.action}
                onClick={action.action}
              >
                {action.icon !== null ? action.icon : <Typography variant='body1' textTransform={'none'}>{action.name}</Typography>}
                {/* <Typography variant='body1' textTransform={'none'}>
                  {action.name}
                </Typography> */}
              </Box>
            }
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
      
      </Box>
    </Container>   
  )
}

export default App
