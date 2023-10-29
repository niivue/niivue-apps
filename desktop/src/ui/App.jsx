import { useState, useEffect, useCallback} from 'react'
import './App.css'
import {nvUtils} from './nvUtils'
import {Niivue, colortables} from '@niivue/niivue'
import {AppContainer} from './components/AppContainer'
import {Row} from './components/Row'
import {Column} from './components/Column'
import {NiiVue} from './components/NiiVue'
import { Sidebar } from './components/Sidebar'
import { FileList } from './components/FileList'
import { ImageTools } from './components/ImageTools'
import { SceneTools } from './components/SceneTools'
import { FileItem } from './components/FileItem'
import { ColormapSelect } from './components/ColormapSelect'
import { MinMaxInput } from './components/MinMaxInput'
import { OpacitySlider } from './components/OpacitySlider'
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  // create a new Niivue object
  const nv = new Niivue()
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
  const [imagesString, setImagesString] = useState(JSON.stringify(images))

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
    }
    getCommsInfo()
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
    // use imagesString here?
  }

  const setVisibility  = useCallback((index, opacity)=>{
    console.log('set visibility')
    console.log(nv)
    nv.setOpacity(index, opacity)
    // update the image at index with the new opacity
    let newImages = images.map((image, i) => {
      if(i === index){
        image.visible = opacity > 0
      }
      return image
    })
    setImagesString(JSON.stringify(newImages))
    setImages(newImages)
  }, [imagesString])


  const setColormap = useCallback((colormap)=>{
    console.log(colormap)
    console.log(nv.volumes.length)
    console.log(activeImage)
    nv.volumes[activeImage].colormap = colormap;
    nv.updateGLVolume();
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
        visible: volume.opacity > 0,
        active: index === activeImage
      }
    })
    console.log(newImages)
    setImagesString(JSON.stringify(newImages))
    setImages(newImages)
  }


  return (
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
                  visible={image.visible}
                  onSetActive={toggleActive}
                  onSetVisibility={setVisibility}
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
              onSetColormap={setColormap}
              />
            {/* min max input */}
            <MinMaxInput />
            {/* opacity slider */}
            <OpacitySlider />
          </ImageTools>
          {/* SceneTools */}
          {/* <SceneTools>
          </SceneTools> */}
        </Sidebar>
        <NiiVue nv={nv}>

        </NiiVue>
      </AppContainer>
  )
}

export default App
