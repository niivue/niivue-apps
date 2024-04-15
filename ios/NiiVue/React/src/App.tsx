import React from 'react'
import { Niivue, NVImage } from '@niivue/niivue';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import DragModeIcon from '@mui/icons-material/AdsClick'; // speed dial icon
import ViewModeIcon from '@mui/icons-material/GridView'; // view mode speed dial icon
import './App.css'

declare global {
  interface Window {
    loadBase64Image: (base64: string) => void,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setCrosshairColor: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    saveDrawing: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setSliceType: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    set3dCrosshairVisible: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setLayout: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setDragMode: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setPenValue: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    set2dCrosshairVisible: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setCornerText: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setOrientationCube: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setRadiological: Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
    moveCrosshairInVox: Function
  }
}

function App() {
  // canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const nvRef = React.useRef<Niivue>(new Niivue(
    {
      logLevel: 'debug'
    }
  ));
  const nv = nvRef.current;
  const backgroundColor = 'black'

  function setSliceType(sliceType: number) {
    nv.opts.multiplanarForceRender = true
    nv.setMultiplanarLayout(2) // 2x2
    nv.setSliceType(sliceType)
  }

  function setLayout(layout: number) {
    nv.opts.multiplanarForceRender = true
    nv.setMultiplanarLayout(layout)
  }

  function set3dCrosshairVisible(visible: boolean) {
    nv.opts.show3Dcrosshair = visible
    nv.updateGLVolume();
    nv.drawScene();
  }

  function setPenValue(value: number, isFilled: boolean, drawingEnabled: boolean = true) {
    nv.setDrawingEnabled(drawingEnabled)
    nv.setPenValue(value, isFilled)
  }

  function setDragMode(dragMode: number) {
    nv.opts.dragMode = dragMode
  }

  function set2dCrosshairVisible(visible: boolean) {
    nv.opts.crosshairWidth = visible ? 1 : 0
    nv.updateGLVolume();
    nv.drawScene();
  }

  function setCornerText(isCorners: boolean) {
    nv.setCornerOrientationText(isCorners)
  }

  function setOrientationCube(visible: boolean) {
    nv.opts.isOrientCube = visible
    nv.updateGLVolume();
    nv.drawScene();
  }

  function setRadiological(isRadiological: boolean) {
    nv.setRadiologicalConvention(isRadiological)
  }

  function moveCrosshairInVox(x: number, y: number, z: number) {
    nv.moveCrosshairInVox(x, y, z)
  }

  const setup = async () => {
    if (!canvasRef.current) {
      return;
    }
    await nv.attachToCanvas(canvasRef.current);
    // await nv.loadVolumes([
    //   {url: 'https://niivue.github.io/niivue-demo-images/chris_t2.nii.gz'},
    // ])
  };

  async function loadBase64Image(base64: string) {
    // name is required for the image to be loaded (file type inferred correctly),
    // but it is not used elsewhere
    const nvimage = NVImage.loadFromBase64({base64:base64, name:'image.nii.gz'})
    nv.closeDrawing()
    nv.volumes = []
    nv.updateGLVolume()
    nv.addVolume(nvimage)
  }

  function setCrosshairColor() {
    nv.setCrosshairColor([0,1,0,0.5])
  }

  function saveDrawing() {
    function uint8ArrayToBase64(buffer: Uint8Array) {
      let binary = '';
      // const bytes = new Uint8Array(buffer);
      const bytes = buffer;
      const len = bytes.byteLength;
      
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      
      return btoa(binary);
  }
    const img = nv.saveImage({ filename: 'niivue_drawing.nii.gz', isSaveDrawing: true, volumeByIndex: 0 })
    // if img is a Uint8Array, convert to base64
    if (img instanceof Uint8Array){
      return uint8ArrayToBase64(img)
    }
    return ""
  }

  React.useEffect(() => {
    setup();
    window.loadBase64Image = loadBase64Image 
    window.setCrosshairColor = setCrosshairColor
    window.saveDrawing = saveDrawing,
    window.setSliceType = setSliceType,
    window.setLayout = setLayout,
    window.set3dCrosshairVisible = set3dCrosshairVisible,
    window.setDragMode = setDragMode,
    window.setPenValue = setPenValue,
    window.set2dCrosshairVisible = set2dCrosshairVisible,
    window.setCornerText = setCornerText,
    window.setOrientationCube = setOrientationCube,
    window.setRadiological = setRadiological,
    window.moveCrosshairInVox = moveCrosshairInVox
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
      {/* THIS IS HIDDEN IN FAVOUR OF iOS UI ELEMENTS */}
      <Box
        style={{
          margin: '0',
          padding: '0',
          display: 'none', // HIDDEN
          flexDirection: 'column',
          height: '100%',
          width: '72px',
          backgroundColor: backgroundColor,
        }}
      >
        {/* speed dial bottom */}
        <SpeedDial
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 14
          }}
          FabProps={{
            size: 'small',
          }}
          ariaLabel="view modes"
          icon={<ViewModeIcon/>}
          direction="left" // open left
        >
        {/* {viewModeActions.map((action) => (
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
        ))} */}
      </SpeedDial>

      {/* speed dial drag modes */}
      <SpeedDial
          sx={{
            position: 'absolute',
            bottom: 84,
            right: 14
          }}
          FabProps={{
            size: 'small',
          }}
          ariaLabel="view modes"
          icon={<DragModeIcon/>}
          direction="left" // open left
        >
        {/* {dragModeActions.map((action) => (
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

              </Box>
            }
            tooltipTitle={action.name}
          />
        ))} */}
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
          // icon={<PencilIcon/>}
          // direction="left" // open left
        >
        {/* {drawActions.map((action) => (
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
              </Box>
            }
            tooltipTitle={action.name}
          />
        ))} */}
      </SpeedDial>
      </Box>
    </Container>   
  )
}

export default App
