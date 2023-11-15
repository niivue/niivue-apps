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
  onLoadSurfaces: onLoadSurfaces,
  onAddVolumeOverlay: onAddVolumeOverlay,
  onSetView: onSetView,
  onSetFrame: onSetFrame,
  onSetColormaps: onSetColormaps,
  onSetDragMode: onSetDragMode,
  onSetViewSelected: onSetViewSelected,
  onCloseAllVolumes: onCloseAllVolumes,
})

async function onLoadVolumes(callback) {
  ipcRenderer.on('loadVolumes', (event, volumes) => {
    console.log(volumes)
    callback(volumes)
  })
}

async function onLoadSurfaces(callback) {
  ipcRenderer.on('loadSurfaces', (event, surfaces) => {
    console.log(surfaces)
    callback(surfaces)
  })
}

async function onAddVolumeOverlay(callback) {
  ipcRenderer.on('addVolumeOverlay', (event, overlay) => {
    console.log(overlay)
    callback(overlay)
  })
}

async function onSetView(callback) {
  ipcRenderer.on('setView', (event, view) => {
    console.log(view)
    callback(view)
  })
}

async function onCloseAllVolumes(callback) {
  ipcRenderer.on('closeAllVolumes', () => {
    callback()
  })
}

async function onSetViewSelected(view) {
  return ipcRenderer.invoke('setViewRadioButton', view);
}

async function onSetFrame(callback) {
  // frame is 1 or -1 for next or previous frame
  ipcRenderer.on('setFrame', (event, frame) => {
    console.log(frame)
    callback(frame)
  })
}

function onSetDragMode(callback) {
  ipcRenderer.on('setDragMode', (event, dragMode) => {
    console.log(dragMode)
    callback(dragMode)
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


async function onSetColormaps(callback) {
  // colormapObj has the keys: name, colormap
  ipcRenderer.on('setColormaps', (event, colormapObj) => {
    console.log(colormapObj)
    callback(colormapObj)
  })
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