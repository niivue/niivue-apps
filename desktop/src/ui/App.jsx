import { useState, useEffect, useCallback, useContext, createContext} from 'react'
import './App.css'
import {nvUtils} from './nvUtils'
import {Niivue, colortables, SLICE_TYPE} from '@niivue/niivue'
import {AppContainer} from './components/AppContainer'
import {NiiVue} from './components/NiiVue'
import { Sidebar } from './components/Sidebar'
import { FileList } from './components/FileList'
import { ImageTools } from './components/ImageTools'
import { FileItem } from './components/FileItem'
import { ColormapSelect } from './components/ColormapSelect'
import { MinMaxInput } from './components/MinMaxInput'
import { OpacitySlider } from './components/OpacitySlider'
import CssBaseline from '@mui/material/CssBaseline';

const _nv = new Niivue()
const NV = createContext(_nv)

const sliceTypes = {
  'axial': SLICE_TYPE.AXIAL,
  'coronal': SLICE_TYPE.CORONAL,
  'sagittal': SLICE_TYPE.SAGITTAL,
  'multiPlanarACS': SLICE_TYPE.MULTIPLANAR,
  'render': SLICE_TYPE.RENDER
}


function App() {
  // create a new Niivue object
  const nv = useContext(NV)
  nv.onImageLoaded = (volume) => {
    console.log('image loaded', volume)
    handleDrop()
  }
  nv.onLocationChange = (locationData)=> {
    // set the window title to locationData.string
    document.title = locationData.string
  }
  
  // get the list of colormap names
  const colormapNames = nv.colormaps(true) // sorted by name
  // create an array of objects with the colormap name and values (used to render the colormap select)
  const colormaps = colormapNames.map((name) => {
    return {
      name: name,
      values: nv.colormapFromKey(name)
    }
  })

  // ------------ State ------------
  // set the initial state of the commsInfo object to an empty object
  const [commsInfo, setCommsInfo] = useState({})
  const [activeImage, setActiveImage] = useState(0) // index of the active image
  const [images, setImages] = useState([])
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [calMin, setCalMin] = useState(0)
  const [calMax, setCalMax] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [colormap, setColormap] = useState('gray') // default

  // ------------ Effects ------------
  // get the comms info from the main process
  // when the app is first loaded
  useEffect(() => {
    async function getCommsInfo(){
      let info = await nvUtils.getCommsInfo()
      console.log(info)
      setCommsInfo(info)

      // set the callback for when volumes are loaded
      nvUtils.onLoadVolumes((imgs) => {
        console.log('loaded volumes', imgs);
        imgs.forEach(async (img) => {
          await addVolume(img, info)
        })
      })

      nvUtils.onCloseAllVolumes(() => {
        let volumes = nv.volumes
        // loop over all volumes from the end of the array to the beginning
        // this is because when a volume is removed, the array is reindexed
        // so if you remove the first volume, the second volume becomes the first
        // and the second volume is never removed
        for(let i = volumes.length - 1; i >= 0; i--){
          nv.removeVolumeByIndex(i)
        }
        setImages([])
        // update active image, min, max, opacity
        setActiveImage(0)
        setMin(0)
        setMax(0)
        setOpacity(1)
        setCalMax(0)
        setCalMin(0)
      });
      // set the callback for when the view needs updating
      nvUtils.onSetView((view) => {
        // clear the mosaic string
        nv.setSliceMosaicString("");
        if (view === 'multiPlanarACSR') {
          nv.opts.multiplanarForceRender = true;
        } else if (view === 'mosaic') {
          // TODO: allow the user to set the mosaic string
          nv.setSliceMosaicString("A 0 20 C 30 S 42");
          nv.opts.multiplanarForceRender = false;
        } else {
          nv.opts.multiplanarForceRender = false;
        }
        nv.setSliceType(sliceTypes[view]);
      });

      // set the callback for when the DRAG mode changes
      nvUtils.onSetDragMode((mode) => {
        switch (mode) {
          case 'pan':
            nv.opts.dragMode = nv.dragModes.pan
            break;
          case 'contrast':
            nv.opts.dragMode = nv.dragModes.contrast
            break;
          case 'measure':
            nv.opts.dragMode = nv.dragModes.measurement
            break;
          case 'none':
            nv.opts.dragMode = nv.dragModes.none
            break;
        }
      });

      // set the callback for when the volume number updates (4D files)
      nvUtils.onSetFrame((frame) => {
        let vol = nv.volumes[activeImage];
        let id = vol.id;
        let currentFrame = vol.frame4D
        nv.setFrame4D(id, currentFrame + frame);
    });

    }
    getCommsInfo()
  }, [])

  // when active image changes, update the min and max
  useEffect(() => {
    if(images.length === 0){
      return
    }
    let vol = nv.volumes[activeImage]
    setCalMin(vol.cal_min)
    setCalMax(vol.cal_max)
    setMin(vol.cal_min)
    setMax(vol.cal_max)
    setOpacity(vol.opacity)
    setColormap(vol.colormap)
  }, [activeImage, images])

  // when user changes intensity with the right click selection box
  // for now, only works with the background image
  useEffect(() => {
    nv.onIntensityChange = (volume) => {
      setMin(volume.cal_min)
      setMax(volume.cal_max)
    }
  }, [])

  // ------------ Helper Functions ------------

  function makeNiivueUrl(path, commsInfo){
    return `http://${commsInfo.host}:${commsInfo.fileServerPort}/${commsInfo.route}?${commsInfo.queryKey}=${path}`
  }

  function toggleActive(name, value){
    console.log(name, value)
    let newImages = images.map((image, index) => {
      if(image.name === name){
        image.active = value
        setActiveImage(index)
      } else {
        image.active = false
      }
      return image
    })
    setImages(newImages)
  }

  const setVisibility  = useCallback((index, opacity)=>{
    nv.setOpacity(index, opacity)
  }, [])

  const updateOpacity = useCallback((opacity)=>{
    nv.setOpacity(activeImage, opacity)
    setOpacity(opacity)
  }, [activeImage])


  const updateColormap = useCallback((colormap)=>{
    nv.volumes[activeImage].colormap = colormap;
    nv.updateGLVolume();
  }, [activeImage])

  const setCalMinMax = useCallback((min, max)=>{
    nv.volumes[activeImage].cal_min = min;
    nv.volumes[activeImage].cal_max = max;
    nv.updateGLVolume();
    setMin(min)
    setMax(max)
  }, [activeImage])

  async function addVolume(path, commsInfo){
    let url = makeNiivueUrl(path, commsInfo)
    console.log(url)
    await nv.addVolumeFromUrl({url: url, name: path})
    let volumes = nv.volumes
    let newImages = volumes.map((volume, index) => {
      return {
        url: volume.url,
        name: volume.name,
        index: index,
        id: volume.id,
        color: volume.colormap,
        active: index === activeImage
      }
    })
    console.log(newImages)
    setImages(newImages)
  }

  function handleDrop(){
    let volumes = nv.volumes
    let newImages = volumes.map((volume, index) => {
      return {
        url: volume.url,
        name: volume.name,
        index: index,
        id: volume.id,
        color: volume.colormap,
        active: index === activeImage
      }
    })
    console.log(newImages)
    setImages(newImages) 
  }

  const handleRemove = useCallback((index) => {
    let vol = nv.volumes[index]
    nv.removeVolume(vol)
    let volumes = nv.volumes
    let newImages = volumes.map((volume, index) => {
      return {
        url: volume.url,
        name: volume.name,
        index: index,
        id: volume.id,
        color: volume.colormap,
        active: index === activeImage
      }
    })
    setActiveImage(0)
    setImages(newImages)
  }, [])


  return (
    <NV.Provider value={_nv}>
      <AppContainer gap={0}>
        <CssBaseline />
        <Sidebar>
          {/* FileList */}
          <FileList>
            {images.map((image, index) => {
              return (
                <FileItem 
                  key={index} 
                  url={image.url} 
                  name={image.name}
                  active={image.active}
                  index={index}
                  onSetActive={toggleActive}
                  onSetVisibility={setVisibility}
                  onRemove={handleRemove}
                  >
                </FileItem>
              )
            })}
          </FileList>
          {/* ImageTools */}
          <ImageTools>
            {/* colormap select */}
            <ColormapSelect 
              colormaps={colormaps}
              onSetColormap={updateColormap}
              colormap={colormap}
              />
            {/* min max input */}
            <MinMaxInput 
              calMin={calMin}
              calMax={calMax}
              min={min}
              max={max}
              onSetMinMax={setCalMinMax} />
            {/* opacity slider */}
            <OpacitySlider
              opacity={opacity}
              onSetOpacity={updateOpacity}
             />
          </ImageTools>
          {/* SceneTools */}
          {/* <SceneTools>
          </SceneTools> */}
        </Sidebar>
        <NiiVue nv={nv}>

        </NiiVue>
      </AppContainer>
    </NV.Provider>
  )
}

export default App
