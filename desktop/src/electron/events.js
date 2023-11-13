// require fs and path
const fs = require('fs').promises
const path = require('path')
const util = require('util') // node.js utility module for promisify


/**
 * gets the file server port and host from the environment variables
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the file server port and host.
 */
async function onGetCommsInfo() {
    let fileServerPort = process.env.NIIVUE_FILESERVER_PORT;
    let host = process.env.NIIVUE_HOST;
    let route = 'file';
    let queryKey = 'filename';
    return {fileServerPort, host, route, queryKey};
}

/**
 * Handles the openFileDialog command.
 * @async
 * @function
 * @param {Array} filters - An array of objects with name and extensions properties.
 * @see https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
 * @returns {Promise<Object>} A promise that resolves to an object with, cancelled, filePaths, and bookmarks properties.
 */
async function onFileDialog(filters=[], cliImages=[]) {
    let result = []
    if (cliImages.length === 0) {
        const { dialog } = require('electron')
        result = await dialog.showOpenDialog({filters:filters, properties: ['openFile', 'multiSelections'] })
    }
    else {
        result = {canceled: false, filePaths: cliImages}
    }
    return result
}

/**
 * Handles the openSaveFileDialog command.
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object with, cancelled, filePaths, and bookmarks properties.
 */
async function onSaveFileDialog() {
    const { dialog } = require('electron')
    const result = await dialog.showSaveDialog({ properties: ['createDirectory', 'showOverwriteConfirmation'] })
    console.log(result)
    return result
}

const events = {
    openFileDialog: onFileDialog,
    openSaveFileDialog: onSaveFileDialog,
    getCommsInfo: onGetCommsInfo,
}

module.exports.events = events

