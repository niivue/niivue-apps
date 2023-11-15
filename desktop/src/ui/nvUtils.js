// Try to get the NIIVUE object from the window object.
// If it doesn't exist, create it.
/**
 * The NIIVUE namespace object. This is the object that is exposed to the renderer process via the context bridge in the preload script from electron.
 * @namespace
 */
const NIIVUE = window.NIIVUE || {};

/**
 * The main NIIVUEJS namespace object.
 * @namespace
 */
export const nvUtils = {};

/**
 * Determines if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a function, false otherwise.
 */
function isFunction(value) {
  return typeof value === "function";
}

/**
 * opens a file dialog in the main process
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the file path and the file name.
 */
nvUtils.openFileDialog = async function () {
  if (isFunction(NIIVUE.openFileDialog)) {
    return await NIIVUE.openFileDialog();
  } else {
    return NIIVUE.openFileDialog;
  }
};

/**
 * opens a save file dialog in the main process
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the file path and the file name.
 */
nvUtils.openSaveFileDialog = async function () {
  if (isFunction(NIIVUE.openSaveFileDialog)) {
    return await NIIVUE.openSaveFileDialog();
  } else {
    return NIIVUE.openSaveFileDialog;
  }
};

/**
 * removes the extension from a string
 * @function
 * @param {string} str - The string to remove the extension from.
 * @param {string} ext - The extension to remove.
 * @returns {string} The string with the extension removed.
 * @example
 * const str = 'test.nii.gz';
 * const strWithoutExt = niivuejs.removeExtension(str);
 * console.log(strWithoutExt);
 */
nvUtils.removeExtension = function (str, ext = ".nii") {
  let arr = str.split(ext);
  arr.pop();
  return arr.join("");
};

/**
 * gets the comms info from the main process
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the comms info.
 * @example
 * const commsInfo = await niivuejs.getCommsInfo();
 * console.log(commsInfo);
 * // { fileServerPort: 12345, host: 'localhost' }
 */
nvUtils.getCommsInfo = async function () {
  if (isFunction(NIIVUE.getCommsInfo)) {
    return await NIIVUE.getCommsInfo();
  } else {
    return NIIVUE.getCommsInfo;
  }
};

nvUtils.onLoadVolumes = function (callback) {
  if (isFunction(NIIVUE.onLoadVolumes)) {
    NIIVUE.onLoadVolumes(callback);
  }
};

nvUtils.onLoadSurfaces = function (callback) {
  if (isFunction(NIIVUE.onLoadSurfaces)) {
    NIIVUE.onLoadSurfaces(callback);
  }
};

nvUtils.onAddVolumeOverlay = function (callback) {
  if (isFunction(NIIVUE.onAddVolumeOverlay)) {
    NIIVUE.onAddVolumeOverlay(callback);
  }
};

nvUtils.onSetView = function (callback) {
  if (isFunction(NIIVUE.onSetView)) {
    NIIVUE.onSetView(callback);
  }
};

nvUtils.onCloseAllVolumes = function (callback) {
  if (isFunction(NIIVUE.onCloseAllVolumes)) {
    NIIVUE.onCloseAllVolumes(callback);
  }
}

nvUtils.onSetDragMode = function (callback) {
  if (isFunction(NIIVUE.onSetDragMode)) {
    NIIVUE.onSetDragMode(callback);
  }
};

nvUtils.onSetFrame = function (callback) {
  if (isFunction(NIIVUE.onSetFrame)) {
    NIIVUE.onSetFrame(callback);
  }
};

nvUtils.onSetColormaps = function (callback) {
  if (isFunction(NIIVUE.onSetColormaps)) {
    NIIVUE.onSetColormaps(callback);
  }
};

nvUtils.webGL2Supported = function () {
  let canvas = document.createElement("canvas");
  let gl = canvas.getContext("webgl2");
  let supported = gl !== null;
  // remove the temporary canvas from the DOM
  canvas.remove();
  return supported;
};

nvUtils.onSetViewSelected = function (view, forceRender = false, mosaic = '') {
  if (isFunction(NIIVUE.onSetViewSelected)) {
    NIIVUE.onSetViewSelected(view, forceRender, mosaic);
  }
};
