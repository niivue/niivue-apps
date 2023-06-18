// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('NIIVUE', {
  nodeVersion: () => process.versions.node,
  chromeVersion: () => process.versions.chrome,
  electronVersion: () => process.versions.electron,
  openFileDialog: openFileDialog,
  openSaveFileDialog: openSaveFileDialog,
  getCommsInfo: getCommsInfo,
  onLoadVolumes: onLoadVolumes,
})

async function onLoadVolumes(callback) {
  ipcRenderer.on('loadVolumes', (event, volumes) => {
    console.log(volumes)
    callback(volumes)
  })
}

/**
 * get the comms info object from the main process
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the comms info.
 */
async function getCommsInfo() {
  return ipcRenderer.invoke('getCommsInfo')
}


/**
 * opens a file dialog in the main process
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the file path and the file name.
 */
async function openFileDialog() {
  return ipcRenderer.invoke('openFileDialog')
}

/**
 * opens a save file dialog in the main process
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the file path and the file name.
 */
async function openSaveFileDialog() {
  return ipcRenderer.invoke('openSaveFileDialog')
}