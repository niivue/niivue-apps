import { useState, useEffect} from 'react'
import './App.css'
import {niivuejs} from './niivuejs'
import {AppContainer} from './components/AppContainer'
import {Row} from './components/Row'
import {NiiVue} from './components/NiiVue'

// the main app component for the bet tool that renders the UI
function App() {
  const [nvImages, setNvImages] = useState([])
  // set the initial state of the commsInfo object to an empty object
  const [commsInfo, setCommsInfo] = useState({})
  

  // send a message to the main process to open a file dialog
  async function openFileDialog(){
    /*
    * results = {
    *   canceled: boolean,
    *  filePaths: string[]
    * }
    */
    let results = await niivuejs.openFileDialog()
    return results 
  }

  // get the comms info from the main process
  // when the app is first loaded
  useEffect(() => {
    async function getCommsInfo(){
      let info = await niivuejs.getCommsInfo()
      console.log(info)
      setCommsInfo(info)
    }
    getCommsInfo()

  }, [])


  return (
      <AppContainer gap={0}>
        <Row height={'100%'} width={'100%'} flexGrow={1}>
          <NiiVue volumes={JSON.stringify(nvImages)}/>
        </Row>
      </AppContainer>
  )
}

export default App
